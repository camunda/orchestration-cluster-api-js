/**
 * API compatibility gate: fails when the public TypeScript API of the current build would
 * stop existing customer code from compiling, compared with a baseline (the last release
 * published from this branch).
 *
 * How: the TypeScript compiler is the judge. For every export of every package entry point
 * in the baseline, we generate a type-level assertion against the current build and
 * type-check the lot:
 *
 * - the export still exists, as a value and/or a type, as before;
 * - functions and constructors: the old argument list is still accepted (compared as
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
 * is replaced by the current one; the published class is checked on its own. Private and
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
import ts from 'typescript';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
// The check file is written inside the repo so the .d.ts files resolve their own
// dependencies (zod, effect, ...) from this repo's node_modules.
const DEFAULT_WORK_DIR = path.join(REPO_ROOT, '.api-compat');
let WORK_DIR = DEFAULT_WORK_DIR;

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
): { dir: string; classes: ClassIndex } {
  const out = path.join(WORK_DIR, label);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  fs.copyFileSync(path.join(pkgDir, 'package.json'), path.join(out, 'package.json'));
  const classes: ClassIndex = new Map();
  const printer = ts.createPrinter();
  const isHidden = (m: ts.ClassElement) =>
    (m.name !== undefined && ts.isPrivateIdentifier(m.name)) ||
    (ts.canHaveModifiers(m) &&
      (ts.getModifiers(m) ?? []).some(
        (mod) =>
          mod.kind === ts.SyntaxKind.PrivateKeyword || mod.kind === ts.SyntaxKind.ProtectedKeyword
      ));
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
    for (const stmt of sf.statements) {
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
              stmt.heritageClauses,
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
          continue;
        }
      }
      parts.push(printer.printNode(ts.EmitHint.Unspecified, stmt, sf));
    }
    if (exportsToAdd.length) parts.push(`export { ${exportsToAdd.join(', ')} };`);
    return `${parts.join('\n')}\n`;
  };

  const walk = (dir: string) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const src = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name !== 'node_modules') walk(src);
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
  walk(pkgDir);
  return { dir: out, classes };
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
  code: string;
}

const COMPAT_HELPERS = `// Generated by scripts/api-compat.ts. Do not edit.
// Compat<New, Old> fails to compile when New cannot be used where Old was.
type Compat<New extends Old, Old> = New;
type Fn = (...args: any) => any;
type Params<T> = T extends Fn ? Parameters<T> : never;
type Ret<T> = T extends Fn ? ReturnType<T> : never;
type Ctor = abstract new (...args: any) => any;
type CtorParams<T> = T extends Ctor ? ConstructorParameters<T> : never;
// Literal-typed constants (e.g. SPEC_HASH) are compared by their base type.
type Widen<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T;
`;

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

function memberAccess(base: string, member: string): string {
  return `${base}[${JSON.stringify(member)}]`;
}

/** Build every assertion for the baseline API. */
function buildAssertions(
  pristineDir: string,
  baselineEntries: Map<string, string>,
  unifiedDir: string,
  unifiedEntries: Map<string, string>,
  currentEntries: Map<string, string>
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
    entryIndex++;
    imports.push(`import type * as ${U} from '${specifier(unifiedEntries.get(entry) as string)}';`);
    imports.push(`import type * as ${N} from '${specifier(newDts)}';`);

    for (const exported of checker.getExportsOfModule(moduleSymbol)) {
      const name = exported.name;
      const target =
        exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
      const decl = target.declarations?.[0];
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
      const oldClassRef = () => {
        const file = decl?.getSourceFile().fileName ?? '';
        const unifiedFile = path.join(unifiedDir, path.relative(pristineDir, file));
        return `import('${specifier(unifiedFile)}').${OLD_CLASS_PREFIX}${target.name}`;
      };
      const oldRef = isClass ? oldClassRef : () => ref(U);
      const inPackage = (sym: ts.Symbol) =>
        (sym.valueDeclaration ?? sym.declarations?.[0])
          ?.getSourceFile()
          .fileName.startsWith(pristineDir) ?? false;

      if (isValue) {
        const o = `typeof ${oldRef()}`;
        const n = `typeof ${ref(N)}`;
        add('value', `Compat<Widen<${n}>, Widen<${o}>>`);
        const valueType = checker.getTypeOfSymbol(target);
        // Assignability lets a required parameter replace an optional one, so arguments
        // are compared as tuples explicitly.
        if (valueType.getCallSignatures().length > 0) {
          add('arguments', `Compat<Params<${o}>, Params<${n}>>`);
          add('return', `Compat<Ret<${n}>, Ret<${o}>>`);
        }
        if (valueType.getConstructSignatures().length > 0) {
          add('constructor arguments', `Compat<CtorParams<${o}>, CtorParams<${n}>>`);
        }
        for (const m of callableMembers(checker, valueType, inPackage)) {
          const om = memberAccess(`(${o})`, m);
          const nm = memberAccess(`(${n})`, m);
          add(`static ${m}() arguments`, `Compat<Params<${om}>, Params<${nm}>>`);
          add(`static ${m}() return`, `Compat<Ret<${nm}>, Ret<${om}>>`);
        }
      }
      if (isClass) {
        // Instances are SDK output: customers read them and call their methods. Methods
        // are compared one by one because TypeScript compares method parameters
        // bivariantly in a whole-type check.
        const args = typeArgs(decl);
        add('instance', `Compat<${ref(N)}${args}, ${oldRef()}${args}>`);
        const declared = checker.getDeclaredTypeOfSymbol(target);
        for (const m of callableMembers(checker, declared, inPackage)) {
          const o = memberAccess(`${oldRef()}${args}`, m);
          const n = memberAccess(`${ref(N)}${args}`, m);
          add(`${m}() arguments`, `Compat<Params<NonNullable<${o}>>, Params<NonNullable<${n}>>>`);
          add(`${m}() return`, `Compat<Ret<NonNullable<${n}>>, Ret<NonNullable<${o}>>>`);
        }
      } else if (isType) {
        // Whether a type change breaks callers depends on the direction it flows (a
        // request type may widen, a response type may narrow), which only its use in a
        // signature tells. So types are compared where values and classes use them; on
        // their own they only have to still exist.
        add('type exists', `${ref(N)}${typeArgs(decl)}`);
      }
    }
  }
  return { assertions, imports, missingEntries };
}

/** Write the check file, type-check it, and map each diagnostic back to its assertion. */
function runAssertions(assertions: Assertion[], imports: string[]): Break[] {
  fs.mkdirSync(WORK_DIR, { recursive: true });
  const checkFile = path.join(WORK_DIR, 'check.ts');
  const header = `${COMPAT_HELPERS}${imports.join('\n')}\n`;
  const headerLines = header.split('\n').length - 1;
  const body = assertions.map((a, i) => `type _${i} = ${a.code};`).join('\n');
  fs.writeFileSync(checkFile, `${header}${body}\nexport {};\n`);

  const program = ts.createProgram([checkFile], {
    strict: true,
    // Customer projects mostly don't enable this; it would also make additions of
    // optional fields look breaking in the read direction.
    exactOptionalPropertyTypes: false,
    skipLibCheck: true,
    noEmit: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    types: [],
  });
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
    const index = line - headerLines;
    const a = assertions[index];
    if (!a) {
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
    typeEntries(current.dir)
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
  const cell = (text: string) => text.replace(/\|/g, '\\|').replace(/\n\s*/g, '<br>');
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

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)
) {
  main();
}
