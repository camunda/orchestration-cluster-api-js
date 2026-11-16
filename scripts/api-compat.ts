/**
 * API compatibility gate: fails when the public TypeScript API of the current build would
 * stop existing customer code from compiling, compared with a baseline (the last release
 * published from this branch).
 *
 * How: the TypeScript compiler is the judge. For every export of every package entry point
 * in the baseline, we generate a type-level assertion against the current build and
 * type-check the lot:
 *
 * - the export still exists, as a value and/or a type, as before; a runtime value must still
 *   be usable as a value (not re-exported with `export type`);
 * - functions and constructors (classes and constructor-valued constants): the old argument list is still accepted (compared as
 *   tuples, because plain assignability lets a required parameter replace an optional
 *   one) and the new return type is assignable to the old one;
 * - classes (e.g. CamundaClient) and other values: the new one is assignable to the old
 *   one, and each callable member is checked like a function. Members are compared one by
 *   one because TypeScript compares method parameters *bivariantly* in a whole-type check,
 *   which would let a method gain a new required request field. Nested methods (methods of
 *   returned objects) get TypeScript's normal comparison. For overloads, `Parameters<>`
 *   sees the last one.
 * - types on their own only have to still exist. Whether a change to a type breaks callers
 *   depends on which way it flows (a request type may widen, a response type may narrow),
 *   and that only shows where a signature uses it, so that is where it is checked.
 *
 * SDK classes appear in signatures as objects customers got from the *current* SDK (e.g.
 * fn.activateJobs(core: CamundaClient)), so in the baseline every class that still exists
 * is replaced by the current one; the published class is checked on its own, including
 * classes that public signatures reach without exporting them. Private and
 * protected members are ignored, literal constants (SPEC_HASH) are compared by their base
 * type, and members inherited from outside the package (Error) are not SDK API.
 *
 * Additions (new exports, new optional parameters or fields, new response fields) pass.
 * Removals, renames, new required parameters/fields, narrowed parameter types and
 * widened return types (e.g. a result field becoming nullable) fail.
 *
 * Usage:
 *   tsx scripts/api-compat.ts --baseline <package dir> [--current <package dir>] [--json <file>]
 *   tsx scripts/api-compat.ts --baseline-version <npm version> [...]
 *
 * A package dir contains package.json (its "exports" give the entry points) and the .d.ts
 * files those point at. --current defaults to this repo (run after the tsup build).
 * --baseline-version downloads that version of this package from npm.
 *
 * Exit codes: 0 compatible, 1 breaking changes found, 2 usage or setup error.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
// The check file is written inside the repo so the .d.ts files resolve their own
// dependencies (zod, effect, ...) from this repo's node_modules.
const DEFAULT_WORK_DIR = path.join(REPO_ROOT, '.api-compat');
let WORK_DIR = DEFAULT_WORK_DIR;
/** Members with more overloads than this have only their last ones compared. */
const MAX_OVERLOADS = 6;

export interface Break {
  entry: string;
  symbol: string;
  check: string;
  message: string;
}

interface Args {
  baseline?: string;
  baselineVersion?: string;
  current: string;
  json?: string;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { current: REPO_ROOT };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (!v) throw new Error(`${a} needs a value`);
      return v;
    };
    if (a === '--baseline') args.baseline = path.resolve(next());
    else if (a === '--baseline-version') args.baselineVersion = next();
    else if (a === '--current') args.current = path.resolve(next());
    else if (a === '--json') args.json = path.resolve(next());
    else throw new Error(`Unknown argument: ${a}`);
  }
  if (!args.baseline === !args.baselineVersion) {
    throw new Error('Pass exactly one of --baseline <dir> or --baseline-version <version>');
  }
  return args;
}

/** Download a published version of this package and return its extracted directory. */
export function fetchBaseline(version: string): string {
  const name = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8')).name;
  const dest = path.join(WORK_DIR, `baseline-${version}`);
  if (fs.existsSync(path.join(dest, 'package', 'package.json'))) return path.join(dest, 'package');
  fs.mkdirSync(dest, { recursive: true });
  const tgz = execFileSync('npm', ['pack', '--silent', `${name}@${version}`], {
    cwd: dest,
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .pop();
  if (!tgz) throw new Error(`npm pack ${name}@${version} produced no tarball`);
  execFileSync('tar', ['xzf', tgz], { cwd: dest });
  return path.join(dest, 'package');
}

/** Where each top-level class of the current build lives: "<chunk>::<Name>" and "<Name>". */
type ClassIndex = Map<string, string>;

/** Bundle chunk names carry a content hash (index-DEzPTBbf.d.ts); drop it to match versions. */
function chunkKey(relPath: string): string {
  return relPath.replace(/-[A-Za-z0-9_-]{8}(\.d\.ts)$/, '$1');
}

const CLASS_EXPORT_PREFIX = '__apiCompat_';
/** In the unified baseline, each original class is kept under this prefix. */
const OLD_CLASS_PREFIX = '__apiCompatOld_';
/** In the unified baseline, the current class that replaced it is exported under this prefix. */
const CUR_CLASS_PREFIX = '__apiCompatCur_';
/** Replaced by a unique suffix per statement assertion. */
const ID = '__ID__';

type PrepareMode =
  /** Current build: also export every top-level class under a stable alias. */
  | { kind: 'current' }
  /** Baseline as published (minus private members): used to check the classes themselves. */
  | { kind: 'pristine' }
  /**
   * Baseline with every class that still exists replaced by the current one. Used for
   * everything except the classes themselves: customers only ever pass SDK objects they
   * got from the current SDK, so e.g. `fn.activateJobs(core: CamundaClient, ...)` must not
   * fail just because CamundaClient gained a field. The classes' own API is still compared
   * against the pristine baseline.
   */
  | { kind: 'unified'; currentDir: string; classes: ClassIndex };

/** Top-level interface or type alias name, for indexing and aliasing. */
function typeDeclName(stmt: ts.Statement): string | undefined {
  return ts.isInterfaceDeclaration(stmt) || ts.isTypeAliasDeclaration(stmt)
    ? stmt.name.text
    : undefined;
}

/**
 * Copy a package's package.json and declaration files into WORK_DIR/<label>, removing
 * private and protected class members (see PrepareMode for the other rewrites).
 *
 * TypeScript compares classes that have private members nominally: two separately
 * declared copies of the same class are never assignable, whatever their public API.
 * Customers can't use private members, so they are not part of the compatibility
 * contract. (Protected members are only reachable by subclassing SDK classes, which we
 * don't support as API.)
 */
function preparePackage(
  pkgDir: string,
  label: string,
  mode: PrepareMode
): { dir: string; classes: ClassIndex; types: ClassIndex; replaced: Set<string> } {
  const out = path.join(WORK_DIR, label);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  fs.copyFileSync(path.join(pkgDir, 'package.json'), path.join(out, 'package.json'));
  const classes: ClassIndex = new Map();
  /** Current mode: where each top-level interface and type alias lives, like `classes`. */
  const types: ClassIndex = new Map();
  /** Unified mode: "<file>::<Name>" of each class replaced by the current one. */
  const replaced = new Set<string>();
  const printer = ts.createPrinter();
  // Constructors stay, whatever their visibility: a public constructor becoming private
  // breaks `new X()`.
  const isHidden = (m: ts.ClassElement) =>
    !ts.isConstructorDeclaration(m) &&
    ((m.name !== undefined && ts.isPrivateIdentifier(m.name)) ||
      (ts.canHaveModifiers(m) &&
        (ts.getModifiers(m) ?? []).some(
          (mod) =>
            mod.kind === ts.SyntaxKind.PrivateKeyword || mod.kind === ts.SyntaxKind.ProtectedKeyword
        )));
  const stripPrivate: ts.TransformerFactory<ts.SourceFile> = (ctx) => (sf) => {
    const visit = (node: ts.Node): ts.Node => {
      if (ts.isClassDeclaration(node)) {
        return ts.factory.updateClassDeclaration(
          node,
          node.modifiers,
          node.name,
          node.typeParameters,
          node.heritageClauses,
          node.members.filter((m) => !isHidden(m))
        );
      }
      return ts.visitEachChild(node, visit, ctx);
    };
    return ts.visitNode(sf, visit) as ts.SourceFile;
  };

  const rewrite = (rel: string, dest: string, sf: ts.SourceFile): string => {
    const parts: string[] = [];
    const exportsToAdd: string[] = [];
    const fileClasses = new Set(
      sf.statements.flatMap((st) => (ts.isClassDeclaration(st) && st.name ? [st.name.text] : []))
    );
    // The kept published class must inherit from the published base, not the current one.
    const oldHeritage = (clauses: ts.NodeArray<ts.HeritageClause> | undefined) =>
      clauses?.map((c) =>
        c.token !== ts.SyntaxKind.ExtendsKeyword
          ? c
          : ts.factory.updateHeritageClause(
              c,
              c.types.map((t) =>
                ts.isIdentifier(t.expression) && fileClasses.has(t.expression.text)
                  ? ts.factory.updateExpressionWithTypeArguments(
                      t,
                      ts.factory.createIdentifier(`${OLD_CLASS_PREFIX}${t.expression.text}`),
                      t.typeArguments
                    )
                  : t
              )
            )
      );
    for (const stmt of sf.statements) {
      // Interfaces and type aliases stay as they are, but get an alias for comparing
      // received types that aren't exported (current: __apiCompat_, baseline: __apiCompatOld_).
      const typeName = typeDeclName(stmt);
      if (typeName && !fileClasses.has(typeName) && mode.kind !== 'pristine') {
        const prefix = mode.kind === 'current' ? CLASS_EXPORT_PREFIX : OLD_CLASS_PREFIX;
        exportsToAdd.push(`${typeName} as ${prefix}${typeName}`);
        if (mode.kind === 'current') {
          types.set(`${chunkKey(rel)}::${typeName}`, dest);
          types.set(typeName, types.has(typeName) && types.get(typeName) !== dest ? '' : dest);
        }
      }
      const name = ts.isClassDeclaration(stmt) ? stmt.name?.text : undefined;
      if (name && mode.kind === 'current') {
        exportsToAdd.push(`${name} as ${CLASS_EXPORT_PREFIX}${name}`);
        classes.set(`${chunkKey(rel)}::${name}`, dest);
        // A bare name only resolves when it is unambiguous across chunks.
        classes.set(name, classes.has(name) && classes.get(name) !== dest ? '' : dest);
      }
      if (name && mode.kind === 'unified' && ts.isClassDeclaration(stmt)) {
        // Keep the published class under another name, for checking the class itself.
        // Its signatures then refer to the *current* versions of other SDK classes.
        parts.push(
          printer.printNode(
            ts.EmitHint.Unspecified,
            ts.factory.updateClassDeclaration(
              stmt,
              (stmt.modifiers ?? []).filter(
                (m) =>
                  m.kind !== ts.SyntaxKind.ExportKeyword && m.kind !== ts.SyntaxKind.DefaultKeyword
              ),
              ts.factory.createIdentifier(`${OLD_CLASS_PREFIX}${name}`),
              stmt.typeParameters,
              oldHeritage(stmt.heritageClauses),
              stmt.members
            ),
            sf
          )
        );
        exportsToAdd.push(`${OLD_CLASS_PREFIX}${name}`);
        const target =
          mode.classes.get(`${chunkKey(rel)}::${name}`) || mode.classes.get(name) || undefined;
        if (target) {
          let spec = path
            .relative(path.dirname(dest), target)
            .replace(/\\/g, '/')
            .replace(/\.d\.ts$/, '');
          if (!spec.startsWith('.')) spec = `./${spec}`;
          const isExported = (ts.getModifiers(stmt) ?? []).some(
            (m) => m.kind === ts.SyntaxKind.ExportKeyword
          );
          const exp = isExported ? 'export ' : '';
          const tps =
            stmt.typeParameters ?? ts.factory.createNodeArray<ts.TypeParameterDeclaration>();
          const tpDecl = tps.length
            ? `<${tps.map((tp) => printer.printNode(ts.EmitHint.Unspecified, tp, sf)).join(', ')}>`
            : '';
          const tpArgs = tps.length ? `<${tps.map((tp) => tp.name.text).join(', ')}>` : '';
          const ref = `import('${spec}').${CLASS_EXPORT_PREFIX}${name}`;
          parts.push(`${exp}type ${name}${tpDecl} = ${ref}${tpArgs};`);
          parts.push(`${exp}declare const ${name}: typeof ${ref};`);
          exportsToAdd.push(`${name} as ${CUR_CLASS_PREFIX}${name}`);
          replaced.add(`${dest}::${name}`);
          continue;
        }
      }
      parts.push(printer.printNode(ts.EmitHint.Unspecified, stmt, sf));
    }
    if (exportsToAdd.length) parts.push(`export { ${[...new Set(exportsToAdd)].join(', ')} };`);
    return `${parts.join('\n')}\n`;
  };

  const walk = (dir: string) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const src = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        // Skip dependencies, dot-dirs and this script's own work dir (when the package
        // is the repo itself, WORK_DIR is inside it).
        if (ent.name !== 'node_modules' && !ent.name.startsWith('.') && src !== WORK_DIR) {
          walk(src);
        }
        continue;
      }
      if (!/\.d\.ts$/.test(ent.name)) continue;
      const rel = path.relative(pkgDir, src);
      const dest = path.join(out, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const sf = ts.createSourceFile(src, fs.readFileSync(src, 'utf8'), ts.ScriptTarget.Latest);
      const [stripped] = ts.transform(sf, [stripPrivate]).transformed;
      fs.writeFileSync(dest, rewrite(rel, dest, stripped));
    }
  };
  // Only the top-level directories the declared entry points live in (e.g. dist/), so a
  // package that is the repo itself doesn't drag in src/, tests/ and so on.
  const roots = new Set<string>();
  const collect = (v: unknown): void => {
    if (typeof v === 'string') {
      if (/\.d\.[cm]?ts$/.test(v)) roots.add(path.normalize(v).split(path.sep)[0]);
    } else if (v && typeof v === 'object') Object.values(v).forEach(collect);
  };
  const pj = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
  collect(pj.exports);
  collect(pj.types);
  collect(pj.typings);
  const dirs = [...roots].map((r) => path.join(pkgDir, r));
  // Declarations at the package root: walk the whole package.
  if (
    dirs.length === 0 ||
    dirs.some((d) => !fs.statSync(d, { throwIfNoEntry: false })?.isDirectory())
  ) {
    walk(pkgDir);
  } else {
    dirs.forEach(walk);
  }
  return { dir: out, classes, types, replaced };
}

/** Entry point subpath ("." , "./logger", ...) -> absolute .d.ts path. */
function typeEntries(pkgDir: string): Map<string, string> {
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
  const out = new Map<string, string>();
  const exportsField = pkg.exports ?? { '.': { types: pkg.types } };
  for (const [subpath, target] of Object.entries<unknown>(exportsField)) {
    if (subpath.endsWith('package.json')) continue;
    let types: string | undefined;
    if (typeof target === 'string') types = target.endsWith('.d.ts') ? target : undefined;
    else if (target && typeof target === 'object') {
      const t = target as Record<string, unknown>;
      types =
        typeof t.types === 'string'
          ? t.types
          : typeof (t.import as Record<string, unknown>)?.types === 'string'
            ? ((t.import as Record<string, unknown>).types as string)
            : undefined;
    }
    if (types) out.set(subpath, path.join(pkgDir, types));
  }
  return out;
}

/** A module specifier for an absolute .d.ts path, usable from WORK_DIR. */
function specifier(dts: string): string {
  let rel = path.relative(WORK_DIR, dts).replace(/\\/g, '/');
  rel = rel.replace(/\.d\.(m|c)?ts$/, '');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

interface Assertion {
  entry: string;
  symbol: string;
  check: string;
  /** A type expression, or a statement when `statement` is set. */
  code: string;
  statement?: boolean;
}

const COMPAT_HELPERS = `// Generated by scripts/api-compat.ts. Do not edit.
// Compat<New, Old> fails to compile when New cannot be used where Old was.
type Compat<New extends Old, Old> = New;
type Fn = (...args: any) => any;
type Params<T> = T extends Fn ? Parameters<T> : never;
type Ret<T> = T extends Fn ? ReturnType<T> : never;
type Ctor = abstract new (...args: any) => any;
type CtorParams<T> = T extends Ctor ? ConstructorParameters<T> : never;
// The shortest argument list a tuple allows. Spreading a tuple with optional elements
// doesn't check arity, so x?: any becoming x: any would otherwise pass.
type MinArgs<T, Acc extends unknown[] = []> = 0 extends 1 & T
  ? T
  : T extends readonly [infer H, ...infer R]
    ? MinArgs<R, [...Acc, H]>
    : Acc;
${overloadHelpers()}
// Field paths of Old that New no longer has, through arrays and nested objects. A removed
// request field breaks object literals (excess property check), a removed optional result
// field breaks reads; assignability catches neither. A key counts as kept if any union
// member has it, as for excess property checks; types without keys accept any.
type Prim = string | number | boolean | bigint | symbol | null | undefined;
type Elem<T> = T extends readonly (infer E)[] ? E : T;
type Obj<T> = Exclude<Elem<NonNullable<T>>, Prim | Fn | Ctor>;
type AllKeys<T> = T extends unknown ? keyof T : never;
type Field<T, K> = T extends unknown ? (K extends keyof T ? T[K] : never) : never;
type LostKeys<O, N, P extends string = '', D extends unknown[] = []> = D['length'] extends 4
  ? never
  : 0 extends 1 & O
    ? never
    : 0 extends 1 & N
      ? never
      : unknown extends N
        ? never
        : [AllKeys<Obj<N>>] extends [never]
          ? never
          : {
              [K in AllKeys<Obj<O>> & string]: K extends AllKeys<Obj<N>>
                ? LostKeys<Field<Obj<O>, K>, Field<Obj<N>, K>, \`\${P}\${K}.\`, [...D, 0]>
                : \`\${P}\${K}\`;
            }[AllKeys<Obj<O>> & string];
// Per argument position, against every current overload.
type LostArgs<OA, NA> = OA extends readonly unknown[]
  ? { [I in keyof OA]-?: LostKeys<OA[I], Field<NA, I>> }[number]
  : never;
// Field paths customers could read on Old but not on New. Unlike request fields, a key
// read without narrowing must be on every union member, and an empty type has none.
type LostReads<O, N, P extends string = '', D extends unknown[] = []> = D['length'] extends 4
  ? never
  : 0 extends 1 & O
    ? never
    : 0 extends 1 & N
      ? never
      : {
          [K in AllKeys<Obj<O>> & string]: K extends (K extends keyof Obj<O> ? keyof Obj<N> : AllKeys<Obj<N>>)
            ? LostReads<Field<Obj<O>, K>, Field<Obj<N>, K>, \`\${P}\${K}.\`, [...D, 0]>
            : \`\${P}\${K}\`;
        }[AllKeys<Obj<O>> & string];
// Assignability ignores readonly; this compares it (a getter without setter counts as readonly).
type Same<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type Writable<T, K extends keyof T> = Same<Pick<T, K>, { -readonly [P in K]: T[P] }>;
type LostWrites<O, N> = {
  [K in keyof O & keyof N & string]-?: string extends K
    ? never
    : Writable<O, K> extends true
      ? Writable<N, K> extends true
        ? never
        : K
      : never;
}[keyof O & keyof N & string];
// Literal-typed constants (e.g. SPEC_HASH) are compared by their base type.
type Widen<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T;
`;

/**
 * Ov<K>_<I><T>: the I-th of exactly K call signatures of T as [args, return]; NewOv the
 * same for construct signatures. Matching a pattern with exactly as many signatures as
 * the baseline member has picks each overload out reliably.
 */
function overloadHelpers(): string {
  const lines: string[] = [];
  for (const [prefix, kw] of [
    ['Ov', ''],
    ['NewOv', 'new '],
  ] as const) {
    for (let k = 1; k <= MAX_OVERLOADS; k++) {
      const sigs = Array.from(
        { length: k },
        (_, i) => `${kw}(...a: infer A${i}): infer R${i}`
      ).join('; ');
      const tuple = Array.from({ length: k }, (_, i) => `[A${i}, R${i}]`).join(', ');
      lines.push(`type ${prefix}${k}<T> = T extends { ${sigs} } ? [${tuple}] : never;`);
    }
  }
  return lines.join('\n');
}

function typeArgs(decl: ts.Declaration | undefined): string {
  const params =
    decl &&
    (ts.isInterfaceDeclaration(decl) ||
      ts.isTypeAliasDeclaration(decl) ||
      ts.isClassDeclaration(decl))
      ? decl.typeParameters
      : undefined;
  return params?.length ? `<${params.map(() => 'any').join(', ')}>` : '';
}

/** Type arguments for only the type parameters without a default. */
function requiredTypeArgs(decl: ts.Declaration | undefined): string {
  const params =
    decl &&
    (ts.isInterfaceDeclaration(decl) ||
      ts.isTypeAliasDeclaration(decl) ||
      ts.isClassDeclaration(decl))
      ? decl.typeParameters
      : undefined;
  const required = (params ?? []).filter((p) => !p.default);
  return required.length ? `<${required.map(() => 'any').join(', ')}>` : '';
}

/**
 * Baseline type parameters written so check.ts can declare them: `params` with their
 * constraints (`<T extends X>`), `names` to pass them on.
 */
interface TypeParamsText {
  params: string;
  names: string[];
}

interface CallCheckOptions {
  /**
   * Symbolic type parameters of the owner are in scope. Field and generic-default checks
   * are left to the `any`-instantiated pass: TypeScript defers them on symbolic types.
   */
  symbolic?: boolean;
  /** A signature's type parameters, when their constraints can be written in check.ts. */
  typeParams?: (sig: ts.Signature) => TypeParamsText | undefined;
  /** Call and construct signatures of a signature's result, checked one level down. */
  resultSigs?: (sig: ts.Signature) => [readonly ts.Signature[], readonly ts.Signature[]];
}

/**
 * A statement that calls (or constructs) the current API with the arguments of each
 * baseline signature and assigns the result to the baseline return type: if existing
 * calls still compile, it does. TypeScript's overload resolution picks the new signature.
 * It also checks that no argument or result field was removed and, for generic
 * signatures, that existing type arguments and defaulted results still work.
 */
function callChecks(
  oldFnType: string,
  newCallee: string,
  sigs: readonly ts.Signature[],
  construct: boolean,
  opts: CallCheckOptions = {}
): string[] {
  const prefix = construct ? 'NewOv' : 'Ov';
  const k = Math.min(Math.max(sigs.length, 1), MAX_OVERLOADS);
  // With more overloads than MAX_OVERLOADS, compare the last K.
  const compared = sigs.slice(-k);
  const call = (fn: string, args: string) => `${construct ? 'new ' : ''}${fn}(...${args})`;
  // Every current overload's arguments: an argument field is kept if any accepts it.
  const newArgs = `${prefix}${MAX_OVERLOADS}<${newCallee}>[number][0]`;
  const out: string[] = [];
  for (let i = 0; i < k; i++) {
    const sig = `${prefix}${k}<${oldFnType}>[${i}]`;
    const parts = [
      `let n${ID}!: ${newCallee}; let a${ID}!: ${sig}[0];`,
      `const rn${ID} = ${call(`n${ID}`, `a${ID}`)}; const r${ID}: ${sig}[1] = rn${ID};`,
      `let m${ID}!: MinArgs<${sig}[0]>; ${call(`n${ID}`, `m${ID}`)};`,
    ];
    if (!opts.symbolic) {
      parts.push(
        `let l${ID}!: LostArgs<${sig}[0], ${newArgs}> | LostReads<Awaited<${sig}[1]>, Awaited<typeof rn${ID}>>; const k${ID}: never = l${ID};`
      );
    }
    const baseline = compared[i];
    const typeParams = baseline?.getTypeParameters() ?? [];
    if (typeParams.length > 0) {
      if (!opts.symbolic) {
        // Inferring the signature above turns type parameters into their constraints, so
        // a changed default (read<T = string>(): T) only shows when both are really
        // called, without a contextual type to infer T from.
        parts.push(
          `let o${ID}!: ${oldFnType}; const ro${ID} = ${call(`o${ID}`, `m${ID}`)}; const rd${ID} = ${call(`n${ID}`, `m${ID}`)}; const rm${ID}: typeof ro${ID} = rd${ID};`
        );
      }
      const required = typeParams.filter(
        (tp) => !tp.symbol.declarations?.some((d) => ts.isTypeParameterDeclaration(d) && d.default)
      ).length;
      const counts: number[] = [];
      for (let c = Math.max(required, 1); c <= typeParams.length; c++) counts.push(c);
      const text = baseline && opts.typeParams?.(baseline);
      if (text) {
        // Every type argument the baseline accepted must still be accepted.
        const probes = counts.map((c) => `p${ID}<${text.names.slice(0, c).join(', ')}>;`);
        parts.push(
          `function c${ID}${text.params}() { let p${ID}!: ${newCallee}; ${probes.join(' ')} }`
        );
      } else {
        parts.push(...counts.map((c) => `n${ID}<${Array(c).fill('any').join(', ')}>;`));
      }
    }
    const [resultCalls, resultCtors] = (baseline && opts.resultSigs?.(baseline)) ?? [[], []];
    // A returned function (or constructor) is called by customers too.
    for (const [nested, isCtor, tag] of [
      [resultCalls, false, 'r'],
      [resultCtors, true, 'q'],
    ] as const) {
      if (nested.length === 0) continue;
      const outer = '__OUTER__';
      const nestedChecks = callChecks(
        `NonNullable<${sig}[1]>`,
        `NonNullable<typeof rn${outer}>`,
        nested,
        isCtor,
        { symbolic: opts.symbolic }
      );
      parts.push(...nestedChecks.map((c) => c.split(ID).join(`${ID}${tag}`).split(outer).join(ID)));
    }
    out.push(parts.join(' '));
  }
  return out;
}

function isPublicMember(sym: ts.Symbol): boolean {
  if (sym.name.startsWith('#') || sym.name.startsWith('__')) return false;
  const decl = sym.valueDeclaration ?? sym.declarations?.[0];
  if (!decl) return true;
  const flags = ts.getCombinedModifierFlags(decl);
  return !(flags & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected));
}

/** Callable public members of a type, by name (one level). */
function callableMembers(
  checker: ts.TypeChecker,
  type: ts.Type,
  inPackage: (sym: ts.Symbol) => boolean
): string[] {
  const names: string[] = [];
  for (const prop of checker.getPropertiesOfType(type)) {
    // Inherited from outside the SDK (e.g. Error.captureStackTrace): not SDK API.
    if (!isPublicMember(prop) || !inPackage(prop)) continue;
    const decl = prop.valueDeclaration ?? prop.declarations?.[0];
    if (!decl) continue;
    const propType = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(prop, decl));
    if (propType.getCallSignatures().length > 0) names.push(prop.name);
  }
  return names;
}

function modifiersOf(node: ts.Node): readonly ts.ModifierLike[] {
  return ts.canHaveModifiers(node) ? (ts.getModifiers(node) ?? []) : [];
}

/** Customers can't construct a class whose constructor is private or protected. */
function hasNonPublicConstructor(decl: ts.Declaration | undefined): boolean {
  if (!decl || !ts.isClassDeclaration(decl)) return false;
  return decl.members.some(
    (m) =>
      ts.isConstructorDeclaration(m) &&
      modifiersOf(m).some(
        (mod) =>
          mod.kind === ts.SyntaxKind.PrivateKeyword || mod.kind === ts.SyntaxKind.ProtectedKeyword
      )
  );
}

function isAbstract(decl: ts.Declaration | undefined): boolean {
  return !!decl && modifiersOf(decl).some((m) => m.kind === ts.SyntaxKind.AbstractKeyword);
}

/** Exported with `export type` somewhere along its re-export chain. */
function isTypeOnlyExport(checker: ts.TypeChecker, sym: ts.Symbol): boolean {
  const seen = new Set<ts.Symbol>();
  for (let s: ts.Symbol | undefined = sym; s && s.flags & ts.SymbolFlags.Alias; ) {
    if (seen.has(s)) break;
    seen.add(s);
    if (s.declarations?.some((d) => ts.isTypeOnlyImportOrExportDeclaration(d))) return true;
    s = checker.getImmediateAliasedSymbol(s);
  }
  return false;
}

/** Writable in the declaration: not readonly, and not a getter without a setter. */
function isWritable(prop: ts.Symbol): boolean {
  const decls = prop.declarations ?? [];
  if (decls.some(ts.isSetAccessorDeclaration)) return true;
  return decls.some(
    (d) =>
      (ts.isPropertyDeclaration(d) || ts.isPropertySignature(d)) &&
      !(ts.getCombinedModifierFlags(d) & ts.ModifierFlags.Readonly)
  );
}

const RECEIVED_KINDS = ts.SymbolFlags.Class | ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias;

/** Library generics whose type arguments keep their whole shape in the result. */
const SHAPE_PRESERVING = new Set([
  'Promise',
  'PromiseLike',
  'Array',
  'ReadonlyArray',
  'Readonly',
  'Partial',
  'Required',
  'NonNullable',
  'Awaited',
  'Set',
  'ReadonlySet',
  'Map',
  'ReadonlyMap',
  'Record',
  'Iterable',
  'IterableIterator',
  'AsyncIterable',
  'AsyncIterableIterator',
  'AsyncGenerator',
  'Generator',
]);

/**
 * Classes, interfaces and type aliases (in the package) whose values customers receive:
 * reached from the exported values through results and properties. A parameter flips the
 * direction, so a callback's parameters (e.g. a job handler's job) are received too.
 * Only the parts of a type customers see are followed: not the operand of `Pick`, `Omit`,
 * `keyof` or an indexed access, whose other fields aren't part of the API.
 * `seen` holds the symbols already walked as [received, passed in]; `writable` collects the
 * received ones customers can write to somewhere, i.e. not only behind `Readonly<>`.
 */
function receivedSymbols(
  checker: ts.TypeChecker,
  roots: ts.Symbol[],
  inPackage: (sym: ts.Symbol) => boolean,
  isDefaultLib: (sym: ts.Symbol) => boolean,
  seen: [Set<ts.Symbol>, Set<ts.Symbol>],
  writable: Set<ts.Symbol>
): ts.Symbol[] {
  const found: ts.Symbol[] = [];
  const queue: Array<[ts.Symbol, boolean, boolean]> = roots.map((s) => [s, true, true]);
  while (queue.length > 0) {
    const [next, received, canWrite] = queue.pop() as [ts.Symbol, boolean, boolean];
    const sym = next.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(next) : next;
    if (received && canWrite) writable.add(sym);
    const seenHere = seen[received ? 0 : 1];
    if (seenHere.has(sym) || !inPackage(sym)) continue;
    seenHere.add(sym);
    // A class passed in is an instance the SDK handed out, not one customers implement.
    if (!received && sym.flags & ts.SymbolFlags.Class) continue;
    if (received && sym.flags & RECEIVED_KINDS) found.push(sym);
    const visit = (node: ts.Node, out: boolean, canWrite = true): void => {
      if (ts.isParameter(node)) {
        if (node.type) visit(node.type, !out);
        return;
      }
      // A constraint takes the direction of the type parameter's uses (queued below).
      if (ts.isTypeParameterDeclaration(node)) return;
      if (
        ts.isIndexedAccessTypeNode(node) ||
        (ts.isTypeOperatorNode(node) && node.operator === ts.SyntaxKind.KeyOfKeyword)
      ) {
        return;
      }
      // Readonly<A | B> applies to each member.
      if (ts.isUnionTypeNode(node) || ts.isIntersectionTypeNode(node)) {
        for (const t of node.types) visit(t, out, canWrite);
        return;
      }
      if (ts.isParenthesizedTypeNode(node)) {
        visit(node.type, out, canWrite);
        return;
      }
      const name = ts.isTypeReferenceNode(node)
        ? node.typeName
        : ts.isExpressionWithTypeArguments(node)
          ? node.expression
          : ts.isTypeQueryNode(node)
            ? node.exprName
            : ts.isImportTypeNode(node)
              ? node.qualifier
              : undefined;
      const found = name && checker.getSymbolAtLocation(name);
      if (found) queue.push([found, out, canWrite]);
      if (
        (ts.isTypeReferenceNode(node) || ts.isExpressionWithTypeArguments(node)) &&
        node.typeArguments
      ) {
        const target =
          found && found.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(found) : found;
        // Type arguments of other generics may be projected (Pick<T, K>); skip them.
        if (target && isDefaultLib(target) && SHAPE_PRESERVING.has(target.name)) {
          // Readonly is shallow: only its argument's own fields lose write access.
          const argWrite = target.name !== 'Readonly';
          for (const arg of node.typeArguments) visit(arg, out, argWrite);
        }
        return;
      }
      ts.forEachChild(node, (child) => visit(child, out));
    };
    for (const d of sym.declarations ?? []) {
      if (ts.isTypeParameterDeclaration(d)) {
        if (d.constraint) visit(d.constraint, received);
      } else {
        visit(d, received);
      }
    }
  }
  return found;
}

/** Build every assertion for the baseline API. */
function buildAssertions(
  pristineDir: string,
  baselineEntries: Map<string, string>,
  unifiedDir: string,
  unifiedEntries: Map<string, string>,
  currentEntries: Map<string, string>,
  replaced: Set<string>,
  currentTypes: ClassIndex
): { assertions: Assertion[]; imports: string[]; missingEntries: Break[] } {
  const program = ts.createProgram([...baselineEntries.values()], {
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
  });
  const checker = program.getTypeChecker();
  const assertions: Assertion[] = [];
  const imports: string[] = [];
  const missingEntries: Break[] = [];
  const inPackage = (sym: ts.Symbol) =>
    (sym.valueDeclaration ?? sym.declarations?.[0])
      ?.getSourceFile()
      .fileName.startsWith(pristineDir) ?? false;
  const unifiedFileOf = (decl: ts.Declaration | undefined) =>
    path.join(unifiedDir, path.relative(pristineDir, decl?.getSourceFile().fileName ?? ''));
  const memberType = (owner: ts.Type, m: string) => {
    const prop = owner.getProperty(m);
    return checker.getNonNullableType(checker.getTypeOfSymbol(prop as ts.Symbol));
  };
  const isDefaultLib = (sym: ts.Symbol) =>
    sym.declarations?.some((d) => program.isSourceFileDefaultLibrary(d.getSourceFile())) ?? false;
  /**
   * Type parameters written for check.ts: references to package types point at their
   * baseline declarations, kept as __apiCompatOld_*. Undefined when a constraint uses
   * something that can't be referenced there (a dependency's type, a namespace, ...).
   */
  const typeParamsText = (
    decls: readonly ts.TypeParameterDeclaration[] | undefined,
    inScope: ReadonlySet<string> = new Set()
  ): TypeParamsText | undefined => {
    if (!decls?.length) return undefined;
    const names = decls.map((d) => d.name.text);
    const usable = new Set([...names, ...inScope]);
    let ok = true;
    const printer = ts.createPrinter({ removeComments: true });
    const rewrite = (node: ts.TypeNode): string => {
      const toCheckFile: ts.TransformerFactory<ts.Node> = (ctx) => (root) => {
        const visit = (n: ts.Node): ts.Node => {
          if (ts.isTypeQueryNode(n) || ts.isImportTypeNode(n)) ok = false;
          if (!ts.isTypeReferenceNode(n)) return ts.visitEachChild(n, visit, ctx);
          if (!ts.isIdentifier(n.typeName)) {
            ok = false;
            return n;
          }
          const args = n.typeArguments?.map((a) => visit(a) as ts.TypeNode);
          const sym = checker.getSymbolAtLocation(n.typeName);
          const target =
            sym && sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym;
          const decl = target?.declarations?.[0];
          if (usable.has(n.typeName.text) || (target && isDefaultLib(target))) {
            return ts.factory.updateTypeReferenceNode(
              n,
              n.typeName,
              args && ts.factory.createNodeArray(args)
            );
          }
          if (
            target &&
            decl &&
            inPackage(target) &&
            ts.isSourceFile(decl.parent) &&
            (ts.isInterfaceDeclaration(decl) ||
              ts.isTypeAliasDeclaration(decl) ||
              ts.isClassDeclaration(decl))
          ) {
            const ref = `import('${specifier(unifiedFileOf(decl))}').${OLD_CLASS_PREFIX}${target.name}`;
            return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(ref), args);
          }
          ok = false;
          return n;
        };
        return ts.visitNode(root, visit) as ts.Node;
      };
      const [out] = ts.transform(node, [toCheckFile]).transformed;
      return printer.printNode(ts.EmitHint.Unspecified, out, node.getSourceFile());
    };
    const params = decls.map(
      (d) => `${d.name.text}${d.constraint ? ` extends ${rewrite(d.constraint)}` : ''}`
    );
    return ok ? { params: `<${params.join(', ')}>`, names } : undefined;
  };
  const sigTypeParams = (sig: ts.Signature) => {
    const decl = sig.getDeclaration() as ts.SignatureDeclaration | undefined;
    return decl && 'typeParameters' in decl ? decl.typeParameters : undefined;
  };
  const defaultCallOpts = (inScope?: ReadonlySet<string>): CallCheckOptions => ({
    typeParams: (sig) => typeParamsText(sigTypeParams(sig), inScope),
    resultSigs: (sig) => {
      const result = checker.getNonNullableType(checker.getReturnTypeOfSignature(sig));
      return [result.getCallSignatures(), result.getConstructSignatures()];
    },
  });
  const addCalls = (
    entry: string,
    symbol: string,
    check: string,
    oldFnType: string,
    newCallee: string,
    t: ts.Type,
    construct = false
  ) => {
    const sigs = construct ? t.getConstructSignatures() : t.getCallSignatures();
    const count = sigs.length;
    callChecks(oldFnType, newCallee, sigs, construct, defaultCallOpts()).forEach((code, i) =>
      assertions.push({
        entry,
        symbol,
        check: count > 1 ? `${check} (overload ${i + 1})` : check,
        code,
        statement: true,
      })
    );
  };
  const addLostKeys = (entry: string, symbol: string, oldType: string, newType: string) =>
    assertions.push({
      entry,
      symbol,
      check: 'fields kept',
      code: `declare const l${ID}: LostReads<${oldType}, ${newType}>; const k${ID}: never = l${ID};`,
      statement: true,
    });
  // Received objects (class instances, results, callback arguments): customers read
  // their fields and call their methods, one by one because of method bivariance.
  const addMemberChecks = (
    entry: string,
    symbol: string,
    oldType: string,
    newType: string,
    declared: ts.Type
  ) => {
    addLostKeys(entry, symbol, oldType, newType);
    for (const m of callableMembers(checker, declared, inPackage)) {
      const key = JSON.stringify(m);
      addCalls(
        entry,
        symbol,
        `${m}()`,
        `NonNullable<${oldType}[${key}]>`,
        `NonNullable<${newType}[${key}]>`,
        memberType(declared, m)
      );
    }
  };
  const addInstanceChecks = (
    entry: string,
    symbol: string,
    check: string,
    oldClass: string,
    newClass: string,
    decl: ts.ClassDeclaration | undefined,
    declared: ts.Type
  ) => {
    const args = typeArgs(decl);
    const oldType = `${oldClass}${args}`;
    const newType = `${newClass}${args}`;
    assertions.push({ entry, symbol, check, code: `Compat<${newType}, ${oldType}>` });
    addMemberChecks(entry, symbol, oldType, newType, declared);
    // With `any` for the class's type parameters, a method parameter that depends on them
    // (set(value: T)) compares as any, so generic classes are also checked symbolically.
    const generic = typeParamsText(decl?.typeParameters);
    if (generic) {
      const inScope = new Set(generic.names);
      const tArgs = `<${generic.names.join(', ')}>`;
      assertions.push({
        entry,
        symbol,
        check: `${check} with the class's type parameters`,
        code: `function s${ID}${generic.params}() { let n${ID}!: ${newClass}${tArgs}; const o${ID}: ${oldClass}${tArgs} = n${ID}; }`,
        statement: true,
      });
      for (const m of callableMembers(checker, declared, inPackage)) {
        const key = JSON.stringify(m);
        callChecks(
          `NonNullable<${oldClass}${tArgs}[${key}]>`,
          `NonNullable<${newClass}${tArgs}[${key}]>`,
          memberType(declared, m).getCallSignatures(),
          false,
          { symbolic: true, typeParams: (sig) => typeParamsText(sigTypeParams(sig), inScope) }
        ).forEach((code) =>
          assertions.push({
            entry,
            symbol,
            check: `${m}() with the class's type parameters`,
            code: `function s${ID}${generic.params}() { ${code} }`,
            statement: true,
          })
        );
      }
    }
    // Assignability ignores readonly, so `x.prop = v` needs its own check.
    for (const prop of checker.getPropertiesOfType(declared)) {
      if (!isPublicMember(prop) || !inPackage(prop) || !isWritable(prop)) continue;
      const key = JSON.stringify(prop.name);
      assertions.push({
        entry,
        symbol,
        check: `${prop.name} writable`,
        code: `declare const w${ID}: ${newType}; declare const v${ID}: ${oldType}[${key}]; w${ID}[${key}] = v${ID};`,
        statement: true,
      });
    }
  };
  const exportedTargets = new Set<ts.Symbol>();
  /** Types customers receive, with the first entry that reaches each. */
  const reached: Array<[ts.Symbol, string]> = [];
  const reachSeen: [Set<ts.Symbol>, Set<ts.Symbol>] = [new Set(), new Set()];
  const writableReached = new Set<ts.Symbol>();

  let entryIndex = 0;
  for (const [entry, oldDts] of baselineEntries) {
    const newDts = currentEntries.get(entry);
    if (!newDts) {
      missingEntries.push({
        entry,
        symbol: '(entry point)',
        check: 'exists',
        message: `Entry point "${entry}" is no longer exported from package.json`,
      });
      continue;
    }
    const source = program.getSourceFile(oldDts);
    const moduleSymbol = source && checker.getSymbolAtLocation(source);
    if (!moduleSymbol) throw new Error(`Cannot read baseline entry ${entry} (${oldDts})`);

    // U: baseline with SDK classes replaced by the current ones (the published classes
    // themselves are kept as __apiCompatOld_*); N: current build.
    const U = `U${entryIndex}`;
    const N = `N${entryIndex}`;
    // A value import, to check runtime exports are still usable as values.
    const NV = `NV${entryIndex}`;
    entryIndex++;
    imports.push(`import type * as ${U} from '${specifier(unifiedEntries.get(entry) as string)}';`);
    imports.push(`import type * as ${N} from '${specifier(newDts)}';`);
    imports.push(`import * as ${NV} from '${specifier(newDts)}';`);

    const moduleExports = checker.getExportsOfModule(moduleSymbol);
    // Exported types have no direction of their own: where values use them decides it.
    const valueExports = moduleExports.filter((s) => {
      const t = s.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(s) : s;
      return (t.flags & ts.SymbolFlags.Value) !== 0;
    });
    for (const sym of receivedSymbols(
      checker,
      valueExports,
      inPackage,
      isDefaultLib,
      reachSeen,
      writableReached
    )) {
      reached.push([sym, entry]);
    }
    for (const exported of moduleExports) {
      const name = exported.name;
      const target =
        exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
      const decl = target.declarations?.[0];
      exportedTargets.add(target);
      const add = (check: string, code: string) =>
        assertions.push({ entry, symbol: name, check, code });
      const isValue = (target.flags & ts.SymbolFlags.Value) !== 0;
      const isClass = (target.flags & ts.SymbolFlags.Class) !== 0;
      const isType =
        (target.flags &
          (ts.SymbolFlags.Interface |
            ts.SymbolFlags.TypeAlias |
            ts.SymbolFlags.Class |
            ts.SymbolFlags.Enum)) !==
        0;
      const ref = (ns: string) => `${ns}.${name === 'default' ? 'default' : name}`;
      // For a class, compare against the published class kept in the unified baseline.
      const oldClassRef = () =>
        `import('${specifier(unifiedFileOf(decl))}').${OLD_CLASS_PREFIX}${target.name}`;
      const oldRef = isClass ? oldClassRef : () => ref(U);

      if (isValue) {
        const o = `typeof ${oldRef()}`;
        const n = `typeof ${ref(N)}`;
        add('value', `Compat<Widen<${n}>, Widen<${o}>>`);
        // `typeof` also accepts an `export type` re-export; customers' `new X()` doesn't.
        if (!isTypeOnlyExport(checker, exported)) {
          assertions.push({
            entry,
            symbol: name,
            check: 'usable as a value',
            code: `void ${ref(NV)};`,
            statement: true,
          });
        }
        const valueType = checker.getTypeOfSymbol(target);
        // Calls are checked by calling: plain assignability lets a required parameter
        // replace an optional one, and compares method parameters bivariantly.
        if (valueType.getCallSignatures().length > 0) {
          addCalls(entry, name, 'call', o, n, valueType);
        }
        const ctorCount = valueType.getConstructSignatures().length;
        if (ctorCount > 0 && !(isClass && (hasNonPublicConstructor(decl) || isAbstract(decl)))) {
          callChecks(o, n, valueType.getConstructSignatures(), true, defaultCallOpts()).forEach(
            (code, i) =>
              assertions.push({
                entry,
                symbol: name,
                check: ctorCount > 1 ? `constructor (overload ${i + 1})` : 'constructor',
                code,
                statement: true,
              })
          );
        }
        for (const m of callableMembers(checker, valueType, inPackage)) {
          const key = JSON.stringify(m);
          addCalls(
            entry,
            name,
            `static ${m}()`,
            `NonNullable<(${o})[${key}]>`,
            `NonNullable<(${n})[${key}]>`,
            memberType(valueType, m)
          );
        }
      }
      if (isClass) {
        addInstanceChecks(
          entry,
          name,
          'instance',
          oldRef(),
          ref(N),
          decl && ts.isClassDeclaration(decl) ? decl : undefined,
          checker.getDeclaredTypeOfSymbol(target)
        );
      } else if (isType) {
        // Whether a type change breaks callers depends on the direction it flows (a
        // request type may widen, a response type may narrow), which only its use in a
        // signature tells. So types are compared where values and classes use them; on
        // their own they only have to still exist.
        add('type exists', `${ref(N)}${typeArgs(decl)}`);
        // Code that leaves defaulted type parameters out must still compile.
        if (requiredTypeArgs(decl) !== typeArgs(decl)) {
          add('type exists (default type arguments)', `${ref(N)}${requiredTypeArgs(decl)}`);
        }
      }
    }
  }
  for (const [sym, entry] of reached) {
    if (sym.flags & ts.SymbolFlags.Class) {
      // Unexported classes were replaced by their current versions in the unified
      // baseline, so their own contract is compared here.
      if (exportedTargets.has(sym)) continue;
      const decl = sym.declarations?.find(ts.isClassDeclaration);
      const file = unifiedFileOf(decl);
      if (!decl || !replaced.has(`${file}::${sym.name}`)) continue;
      const mod = `import('${specifier(file)}')`;
      addInstanceChecks(
        entry,
        sym.name,
        'instance (reached through public signatures)',
        `${mod}.${OLD_CLASS_PREFIX}${sym.name}`,
        `${mod}.${CUR_CLASS_PREFIX}${sym.name}`,
        decl,
        checker.getDeclaredTypeOfSymbol(sym)
      );
      continue;
    }
    // Received interfaces and type aliases, exported or not. A removed or renamed
    // unexported one shows in the signatures that use it.
    const decl = sym.declarations?.find(
      (d) => ts.isInterfaceDeclaration(d) || ts.isTypeAliasDeclaration(d)
    );
    if (!decl) continue;
    const rel = path.relative(pristineDir, decl.getSourceFile().fileName);
    const current = currentTypes.get(`${chunkKey(rel)}::${sym.name}`) || currentTypes.get(sym.name);
    if (!current) continue;
    const args = typeArgs(decl);
    const oldType = `import('${specifier(unifiedFileOf(decl))}').${OLD_CLASS_PREFIX}${sym.name}${args}`;
    const newType = `import('${specifier(current)}').${CLASS_EXPORT_PREFIX}${sym.name}${args}`;
    const declared = checker.getDeclaredTypeOfSymbol(sym);
    addMemberChecks(entry, sym.name, oldType, newType, declared);
    if (writableReached.has(sym)) {
      assertions.push({
        entry,
        symbol: sym.name,
        check: 'fields still writable',
        code: `declare const l${ID}: LostWrites<${oldType}, ${newType}>; const k${ID}: never = l${ID};`,
        statement: true,
      });
    }
    // A received function or constructor type (interface Handler { (x?: unknown): void }).
    if (declared.getCallSignatures().length > 0) {
      addCalls(entry, sym.name, 'call', oldType, newType, declared);
    }
    if (declared.getConstructSignatures().length > 0) {
      addCalls(entry, sym.name, 'construct', oldType, newType, declared, true);
    }
  }
  return { assertions, imports, missingEntries };
}

/**
 * skipLibCheck hides an import in the declarations that doesn't resolve, and its types
 * then become `any`: that both hides breaks and reports false ones. Fail instead.
 */
function assertImportsResolve(program: ts.Program, options: ts.CompilerOptions): void {
  const host = ts.createCompilerHost(options);
  const ambient = new Set(
    program
      .getTypeChecker()
      .getAmbientModules()
      .map((m) => m.name.replace(/^"|"$/g, ''))
  );
  const unresolved = new Set<string>();
  for (const sf of program.getSourceFiles()) {
    if (!sf.isDeclarationFile || !sf.fileName.startsWith(WORK_DIR)) continue;
    for (const st of sf.statements) {
      const spec =
        (ts.isImportDeclaration(st) || ts.isExportDeclaration(st)) &&
        st.moduleSpecifier &&
        ts.isStringLiteral(st.moduleSpecifier)
          ? st.moduleSpecifier.text
          : undefined;
      if (!spec || ambient.has(spec)) continue;
      if (!ts.resolveModuleName(spec, sf.fileName, options, host).resolvedModule) {
        unresolved.add(spec);
      }
    }
  }
  if (unresolved.size > 0) {
    throw new Error(
      `The declarations import modules that don't resolve, so their types would be any: ${[...unresolved].join(', ')}. Install the dependencies (npm ci) first.`
    );
  }
}

/** Write the check file, type-check it, and map each diagnostic back to its assertion. */
function runAssertions(assertions: Assertion[], imports: string[]): Break[] {
  fs.mkdirSync(WORK_DIR, { recursive: true });
  const checkFile = path.join(WORK_DIR, 'check.ts');
  const header = `${COMPAT_HELPERS}${imports.join('\n')}\n`;
  const headerLines = header.split('\n').length - 1;
  const rendered = assertions.map((a, i) =>
    a.statement ? a.code.split(ID).join(`_${i}`) : `type _${i} = ${a.code};`
  );
  // An assertion can span lines (a printed constraint can), so map every line to its owner.
  const owners = rendered.flatMap((text, i) => text.split('\n').map(() => i));
  fs.writeFileSync(checkFile, `${header}${rendered.join('\n')}\nexport {};\n`);

  const options: ts.CompilerOptions = {
    strict: true,
    // Customer projects mostly don't enable this; it would also make additions of
    // optional fields look breaking in the read direction.
    exactOptionalPropertyTypes: false,
    skipLibCheck: true,
    noEmit: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    // The SDK's declarations import Node built-ins (node:worker_threads).
    types: ['node'],
  };
  const program = ts.createProgram([checkFile], options);
  assertImportsResolve(program, options);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  const breaks = new Map<number, Break>();
  const other: string[] = [];
  for (const d of diagnostics) {
    // Paths into the work dir are noise: show them relative to it (old/, new/, ...).
    const text = ts
      .flattenDiagnosticMessageText(d.messageText, '\n')
      .split(`${WORK_DIR}${path.sep}`)
      .join('');
    if (d.file?.fileName !== checkFile || d.start === undefined) {
      other.push(text);
      continue;
    }
    const line = d.file.getLineAndCharacterOfPosition(d.start).line;
    const index = owners[line - headerLines];
    const a = index === undefined ? undefined : assertions[index];
    if (!a || index === undefined) {
      other.push(`check.ts:${line + 1}: ${text}`);
      continue;
    }
    if (!breaks.has(index)) {
      breaks.set(index, {
        entry: a.entry,
        symbol: a.symbol,
        check: a.check,
        message: summarise(text),
      });
    }
  }
  if (other.length > 0) {
    throw new Error(`The compatibility check itself failed to compile:\n${other.join('\n')}`);
  }
  return [...breaks.values()];
}

/** Keep the useful head of a TS assignability chain. */
function summarise(text: string): string {
  const lines = text.split('\n').map((l) => l.trim());
  return lines.slice(0, 6).join('\n    ');
}

export function checkCompat(
  baselineDir: string,
  currentDir: string,
  /** Must be inside this repo, so dependencies resolve from its node_modules. */
  workDir: string = DEFAULT_WORK_DIR
): {
  breaks: Break[];
  checked: number;
} {
  WORK_DIR = workDir;
  for (const [entry, dts] of typeEntries(currentDir)) {
    if (!fs.existsSync(dts)) {
      throw new Error(`Missing ${dts} for entry "${entry}". Build the package first (tsup).`);
    }
  }
  const current = preparePackage(currentDir, 'new', { kind: 'current' });
  // The pristine copy is only read to enumerate the baseline API.
  const pristine = preparePackage(baselineDir, 'old', { kind: 'pristine' });
  const baselineEntries = typeEntries(pristine.dir);
  if (baselineEntries.size === 0) throw new Error(`No type entry points in ${baselineDir}`);
  const unified = preparePackage(baselineDir, 'old-unified', {
    kind: 'unified',
    currentDir: current.dir,
    classes: current.classes,
  });
  const { assertions, imports, missingEntries } = buildAssertions(
    pristine.dir,
    baselineEntries,
    unified.dir,
    typeEntries(unified.dir),
    typeEntries(current.dir),
    unified.replaced,
    current.types
  );
  return {
    breaks: [...missingEntries, ...runAssertions(assertions, imports)],
    checked: assertions.length,
  };
}

/** In GitHub Actions, list the breaks in the job summary. */
function writeStepSummary(result: ReturnType<typeof checkCompat>, baselineLabel: string): void {
  const file = process.env.GITHUB_STEP_SUMMARY;
  if (!file) return;
  const cell = (text: string) =>
    text
      .replace(/\\/g, '\\\\')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\|/g, '\\|')
      .replace(/\n\s*/g, '<br>');
  const lines = [`## API compatibility with ${baselineLabel}`, ''];
  if (result.breaks.length === 0) {
    lines.push(`Compatible (${result.checked} checks).`);
  } else {
    lines.push(
      `**${result.breaks.length} breaking change(s).** Existing code using these could stop compiling.`,
      '',
      '| Entry | Export | Check | Detail |',
      '| --- | --- | --- | --- |',
      ...result.breaks.map(
        (b) =>
          `| \`${b.entry}\` | \`${b.symbol}\` | ${cell(b.check)} | <details><summary>compiler</summary>${cell(b.message)}</details> |`
      )
    );
  }
  fs.appendFileSync(file, `${lines.join('\n')}\n`);
}

function main() {
  let args: Args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error((e as Error).message);
    process.exit(2);
  }
  let result: ReturnType<typeof checkCompat>;
  let baselineLabel: string;
  try {
    const baselineDir = args.baseline ?? fetchBaseline(args.baselineVersion as string);
    baselineLabel =
      args.baselineVersion ??
      JSON.parse(fs.readFileSync(path.join(baselineDir, 'package.json'), 'utf8')).version;
    result = checkCompat(baselineDir, args.current);
  } catch (e) {
    console.error(`::error::API compatibility check could not run: ${(e as Error).message}`);
    process.exit(2);
  }
  if (args.json) fs.writeFileSync(args.json, `${JSON.stringify(result, null, 2)}\n`);
  writeStepSummary(result, baselineLabel);

  if (result.breaks.length === 0) {
    console.log(
      `API compatible with ${baselineLabel} (${result.checked} checks over the baseline's public API).`
    );
    return;
  }
  console.log(
    `::error::${result.breaks.length} breaking API change(s) compared with ${baselineLabel}. ` +
      'Existing code using these could stop compiling.'
  );
  for (const b of result.breaks) {
    console.log(`\n✖ [${b.entry}] ${b.symbol}: ${b.check}\n    ${b.message}`);
  }
  process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
  main();
}
