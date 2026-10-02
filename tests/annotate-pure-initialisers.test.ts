/*
 * Regression guard for hooks/post/715-annotate-pure-initialisers.ts (issue #537, phase 2).
 *
 * That hook is the pipeline's safety net for tree-shaking: every top-level
 * `const x = call(...)` in `src/gen` must be annotated `/* @__PURE__ *\/` (reviewed
 * callee) or FAIL the pipeline (unreviewed callee). Copilot PR review found the
 * detector was fail-open when the generated formatter places the callee on the
 * line after the `=` (e.g. `const client =\n  createClient(...)`): the regex
 * required the call to begin on the declaration line, so that valid generated
 * shape bypassed BOTH the annotation and the unreviewed-call gate.
 *
 * These tests run the real hook against a synthetic `src/gen` tree in a temp
 * directory and cover the whole defect class — every top-level call shape the
 * generator can plausibly emit (single-line, multiline callee, multiline args,
 * nested calls, generics) — not just the one instance from the review.
 */
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterAll, afterEach, describe, expect, it } from 'vitest';
import { annotatePureInitialisers } from '../hooks/post/715-annotate-pure-initialisers';

const PURE = '/* @__PURE__ */';

/** Temp dirs awaiting cleanup by the next afterEach (cleared each test). */
const created: string[] = [];
/**
 * Every temp dir this suite EVER created — never cleared, so afterAll can prove
 * the cleanup removed all of them. Tracking must be separate from `created`:
 * afterEach empties `created`, so an afterAll check against `created` alone would
 * always see `[]` and could never detect a leak (Copilot review, PR #539).
 */
const allCreated: string[] = [];
let work: string;

/**
 * Run the hook against a temp src/gen containing `files`, IN-PROCESS. Calling
 * annotatePureInitialisers() directly (rather than spawning `tsx` per case)
 * keeps the table-driven suites fast and deterministic: spawning a subprocess
 * that loads the TypeScript compiler cost ~10 s each and blew the test timeouts.
 * `result.status` / `result.stderr` mirror the CLI contract the pipeline relies
 * on: non-zero status + the callee name in stderr when a call is unreviewed.
 */
function runHook(files: Record<string, string>) {
  work = mkdtempSync(join(tmpdir(), 'annotate-pure-'));
  created.push(work);
  allCreated.push(work);
  for (const [name, body] of Object.entries(files)) {
    const p = join(work, 'src', 'gen', name);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, body);
  }
  let result: { status: number; stderr: string };
  try {
    const { unreviewed } = annotatePureInitialisers(work);
    result = { status: unreviewed.length ? 1 : 0, stderr: unreviewed.join('\n') };
  } catch (err) {
    result = { status: 1, stderr: err instanceof Error ? (err.stack ?? err.message) : String(err) };
  }
  const read = (name: string) => readFileSync(join(work, 'src', 'gen', name), 'utf8');
  return { result, read };
}

afterEach(() => {
  for (const dir of created) rmSync(dir, { recursive: true, force: true });
  created.length = 0;
});

// Review finding: `work` was overwritten on each runHook call, so afterEach
// removed only the LAST temp dir — the table-driven failure tests leaked ten
// dirs per suite run. afterEach now tracks and removes the full set; this
// end-of-suite assertion is the regression signal that nothing leaked. It checks
// `allCreated` (the never-cleared suite-lifetime list), NOT `created`: afterEach
// empties `created` after every test, so a check against it would always pass
// even if cleanup removed only a subset.
afterAll(() => {
  const leaked = allCreated.filter((dir) => existsSync(dir));
  expect(leaked).toEqual([]);
});

describe('715-annotate-pure-initialisers', () => {
  it('annotates a single-line top-level initialiser and its nested call', () => {
    const { result, read } = runHook({
      'client.gen.ts': `export const client = createClient(createConfig({ throwOnError: true }));\n`,
    });
    expect(result.status).toBe(0);
    expect(read('client.gen.ts')).toBe(
      `export const client = ${PURE} createClient(${PURE} createConfig({ throwOnError: true }));\n`
    );
  });

  it('annotates an initialiser whose callee the formatter wrapped onto the next line', () => {
    // The reviewed regression: `const client =\n  createClient(...)` must not
    // bypass the hook.
    const { result, read } = runHook({
      'client.gen.ts': `export const client =\n  createClient(createConfig({ throwOnError: true }));\n`,
    });
    expect(result.status).toBe(0);
    expect(read('client.gen.ts')).toBe(
      `export const client =\n  ${PURE} createClient(${PURE} createConfig({ throwOnError: true }));\n`
    );
  });

  it('annotates nested calls split across several lines', () => {
    const { result, read } = runHook({
      'client.gen.ts': [
        'export const client =',
        '  createClient(',
        '    createConfig<ClientOptions2>({ throwOnError: true })',
        '  );',
        '',
      ].join('\n'),
    });
    expect(result.status).toBe(0);
    expect(read('client.gen.ts')).toBe(
      [
        'export const client =',
        `  ${PURE} createClient(`,
        `    ${PURE} createConfig<ClientOptions2>({ throwOnError: true })`,
        '  );',
        '',
      ].join('\n')
    );
  });

  it('annotates an initialiser whose argument list spans lines', () => {
    const { result, read } = runHook({
      'utils.gen.ts': `const defaultQuerySerializer = createQuerySerializer({\n  allowReserved: false,\n});\n`,
    });
    expect(result.status).toBe(0);
    expect(read('utils.gen.ts')).toBe(
      `const defaultQuerySerializer = ${PURE} createQuerySerializer({\n  allowReserved: false,\n});\n`
    );
  });

  it('fails the pipeline on an unreviewed call, even when wrapped onto the next line', () => {
    // The fail-open half of the defect: an unrecognised top-level call must be a
    // pipeline error in EVERY formatting shape, so a generator upgrade cannot
    // silently re-break tree-shaking.
    for (const src of [
      `export const x = sneakySideEffect();\n`,
      `export const x =\n  sneakySideEffect();\n`,
      `export const x =\n  sneakySideEffect(\n    'arg'\n  );\n`,
    ]) {
      const { result } = runHook({ 'evil.gen.ts': src });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('sneakySideEffect');
    }
  });

  it('fails the pipeline on an unreviewed call NESTED inside a reviewed initialiser', () => {
    // Second review finding: `createClient(sneakySideEffect())` was accepted —
    // the outer reviewed callee marked the statement consumed, and the nested
    // pass only matched names already in PURE_CALLEES, so the unknown nested
    // call was neither annotated nor gated. Every eagerly evaluated nested
    // call/new with an unknown callee must fail the pipeline, in every shape.
    for (const src of [
      `export const client = createClient(sneakySideEffect());\n`,
      `export const client =\n  createClient(sneakySideEffect());\n`,
      `export const client = createClient(\n  sneakySideEffect()\n);\n`,
      `export const client = createClient(new Sneaky());\n`,
      `export const client = createClient(sneaky(createConfig()));\n`,
    ]) {
      const { result } = runHook({ 'evil.gen.ts': src });
      expect(result.status).toBe(1);
      expect(result.stderr.toLowerCase()).toContain('sneaky');
    }
  });

  it('fails the pipeline on an unreviewed nested callee that is already /* @__PURE__ */-annotated', () => {
    // Third review finding: the gate trusted a pre-existing `/* @__PURE__ */`
    // annotation on a nested callee, so `createClient(/* @__PURE__ */ sneakySideEffect())`
    // passed even though `sneakySideEffect` was never reviewed. A bundler hint
    // emitted upstream is not the promised human review — reviewed and
    // bundler-known callees are already exempt above, so any OTHER annotated
    // callee must still fail, in every shape.
    for (const src of [
      `export const client = createClient(${PURE} sneakySideEffect());\n`,
      `export const client =\n  createClient(${PURE} sneakySideEffect());\n`,
      `export const client = createClient(\n  ${PURE} sneakySideEffect()\n);\n`,
      `export const client = createClient(${PURE} new Sneaky());\n`,
      `export const client = createClient(createConfig(${PURE} sneaky()));\n`,
    ]) {
      const { result } = runHook({ 'evil.gen.ts': src });
      expect(result.status).toBe(1);
      expect(result.stderr.toLowerCase()).toContain('sneaky');
    }
  });

  it('is idempotent: already-annotated initialisers are left untouched', () => {
    const annotated = `export const client: Client = ${PURE} createClient(${PURE} createConfig<ClientOptions2>({ throwOnError: true }));\n`;
    const { result, read } = runHook({ 'client.gen.ts': annotated });
    expect(result.status).toBe(0);
    expect(read('client.gen.ts')).toBe(annotated);
  });

  it('leaves bundler-known-pure constructors and non-call declarations alone', () => {
    const src = `const m = new Map();\nconst n = 5;\nexport const s = 'str';\n`;
    const { result, read } = runHook({ 'params.gen.ts': src });
    expect(result.status).toBe(0);
    expect(read('params.gen.ts')).toBe(src);
  });

  it('does not touch zod.gen.ts (excluded: global-registry side effects)', () => {
    const src = `export const z = zodRegistry.register(SomeSchema);\n`;
    const { result, read } = runHook({ 'zod.gen.ts': src });
    expect(result.status).toBe(0);
    expect(read('zod.gen.ts')).toBe(src);
  });

  it('removes every temp dir it creates, including across table-driven loops', () => {
    // Exercise the leak path: several runHook calls in one test, like the
    // table-driven failure tests above. The afterAll hook asserts the suite
    // left nothing on disk.
    for (const src of [`export const x = a();\n`, `export const x = b();\n`]) {
      runHook({ 'evil.gen.ts': src });
    }
    // Both dirs are still live (afterEach has not run yet) and both are tracked.
    expect(created.length).toBeGreaterThanOrEqual(2);
    for (const dir of created) expect(existsSync(dir)).toBe(true);
  });

  it('fails the pipeline on an unreviewed call wrapped in parentheses or awaited', () => {
    // Review finding (previously missed): the fail-closed gate anchored the
    // callee immediately after `=`, so `const x = (sneakySideEffect())` and
    // `const x = await sneakySideEffect()` were never marked consumed and never
    // gated — a formatting or generator change to either shape would silently
    // bypass tree-shaking review. Both must fail like any other unreviewed call.
    for (const src of [
      `export const x = (sneakySideEffect());\n`,
      `export const x = ((sneakySideEffect()));\n`,
      `export const x = await sneakySideEffect();\n`,
      `export const x = await (sneakySideEffect());\n`,
      `export const x =\n  await sneakySideEffect();\n`,
    ]) {
      const { result } = runHook({ 'evil.gen.ts': src });
      expect(result.status).toBe(1);
      expect(result.stderr.toLowerCase()).toContain('sneaky');
    }
  });

  it('fails the pipeline on an unreviewed eager call wrapped in ANY expression (ternary, ??, &&, array, object)', () => {
    // Review finding (previously missed): the fail-closed invariant was bypassed
    // when a top-level call was wrapped in an expression other than
    // await/parentheses. `const x = enabled ? sneaky() : undefined` and
    // `const x = existing ?? sneaky()` produced no match, so the eager call was
    // neither annotated nor rejected — fail-open in every such shape. The gate
    // now walks the AST and rejects an eagerly-evaluated unknown call regardless
    // of the surrounding expression wrapper.
    for (const src of [
      `export const x = enabled ? sneakySideEffect() : undefined;\n`,
      `export const x = cond ? other : sneakySideEffect();\n`,
      `export const x = existing ?? sneakySideEffect();\n`,
      `export const x = a && sneakySideEffect();\n`,
      `export const x = a || sneakySideEffect();\n`,
      `export const x = [sneakySideEffect()];\n`,
      `export const x = { k: sneakySideEffect() };\n`,
      `export const x = \`\${sneakySideEffect()}\`;\n`,
    ]) {
      const { result } = runHook({ 'evil.gen.ts': src });
      expect(result.status).toBe(1);
      expect(result.stderr.toLowerCase()).toContain('sneaky');
    }
  });

  it('does NOT reject or annotate calls that are LAZILY evaluated inside a function/arrow/class body', () => {
    // The dual of the fail-open fix: the gate must distinguish an EAGER
    // module-init call from a LAZY call in a deferred body. The 240+ generated
    // SDK methods are arrow functions whose bodies call
    // `(options?.client ?? client).method(...)` only when later invoked — and are
    // textually identical to an eager `a ?? sneaky()`. A text matcher cannot tell
    // them apart; the AST gate must leave every lazy shape untouched (no
    // rejection, no annotation), or it would false-positive on the whole SDK.
    const lazy = [
      `export const getFoo = (options) => (options?.client ?? client).get({ url: '/x' });\n`,
      `export const makeFoo = () => sneakySideEffect();\n`,
      `export const asyncFoo = async () => sneakySideEffect();\n`,
      `export const obj = { run() { return sneakySideEffect(); } };\n`,
      `export const cls = class { m() { return sneakySideEffect(); } };\n`,
    ].join('');
    const { result, read } = runHook({ 'sdk.gen.ts': lazy });
    expect(result.status).toBe(0);
    expect(read('sdk.gen.ts')).toBe(lazy); // left byte-for-byte untouched
  });

  it('fails the pipeline on an eager call in a class EAGER part (extends, computed name, static field, static block, decorator)', () => {
    // Review finding (previously missed): the gate returned on any class, but
    // defining a class eagerly evaluates its `extends` expression, computed
    // member names, static field initialisers, static blocks and decorators, so
    // `const C = class { static v = sneaky() }` ran an unreviewed call at import
    // time yet passed. Every eager class part must now reach the gate.
    for (const src of [
      `export const C = class extends sneakySideEffect() {};\n`,
      `export const C = class { static value = sneakySideEffect(); };\n`,
      `export const C = class { static { sneakySideEffect(); } };\n`,
      `export const C = class { [sneakySideEffect()] = 1; };\n`,
      `export const C = class { [sneakySideEffect()]() {} };\n`,
      `class C { static value = sneakySideEffect(); }\n`,
      `@sneakySideEffect() class C {}\n`,
      `class C { @sneakySideEffect() method() {} }\n`,
    ]) {
      const { result } = runHook({ 'evil.gen.ts': src });
      expect(result.status).toBe(1);
      expect(result.stderr.toLowerCase()).toContain('sneaky');
    }
  });

  it('does NOT reject a call in a class DEFERRED part (instance-field initialiser or method/accessor/constructor body)', () => {
    // The dual of the class fix: instance-field initialisers run at construction
    // and method/accessor/constructor bodies run when invoked, so a call there is
    // lazy and must be left untouched — otherwise the gate false-positives on
    // ordinary generated classes.
    const lazy = [
      `export const A = class { field = sneakySideEffect(); };\n`,
      `export const B = class { m() { return sneakySideEffect(); } };\n`,
      `export const D = class { get g() { return sneakySideEffect(); } };\n`,
      `export const E = class { constructor() { sneakySideEffect(); } };\n`,
      `class F { field = sneakySideEffect(); }\n`,
    ].join('');
    const { result, read } = runHook({ 'sdk.gen.ts': lazy });
    expect(result.status).toBe(0);
    expect(read('sdk.gen.ts')).toBe(lazy); // left byte-for-byte untouched
  });

  it('gates eager calls in top-level statements that are NOT variable declarations', () => {
    // Review finding (previously missed): the loop only scanned variable
    // statements, so an eager call in a bare expression statement
    // (`registerPlugin();`), an `export default createClient()`, or an `export =`
    // never reached the gate. Unreviewed eager callees in those statement forms
    // must fail just like a variable initialiser.
    for (const src of [
      `sneakySideEffect();\n`,
      `export default sneakySideEffect();\n`,
      `export = sneakySideEffect();\n`,
      `(sneakySideEffect());\n`,
      `new Sneaky();\n`,
    ]) {
      const { result } = runHook({ 'evil.gen.ts': src });
      expect(result.status).toBe(1);
      expect(result.stderr.toLowerCase()).toContain('sneaky');
    }
  });

  it('annotates a reviewed eager call in a non-variable top-level statement', () => {
    // The pure counterpart: a reviewed callee in an `export default` is annotated
    // just like one in a variable initialiser.
    const { result, read } = runHook({
      'client.gen.ts': `export default createClient(createConfig({ throwOnError: true }));\n`,
    });
    expect(result.status).toBe(0);
    expect(read('client.gen.ts')).toBe(
      `export default ${PURE} createClient(${PURE} createConfig({ throwOnError: true }));\n`
    );
  });

  it('leaves top-level function and lazy class declarations untouched', () => {
    // A top-level `function`/`class` declaration is itself deferred; only its
    // eager parts (handled above) matter. A plain declaration must pass clean.
    const src = `export function f() { return sneakySideEffect(); }\nexport class C { m() { return sneakySideEffect(); } }\n`;
    const { result, read } = runHook({ 'decls.gen.ts': src });
    expect(result.status).toBe(0);
    expect(read('decls.gen.ts')).toBe(src);
  });

  it('fails the pipeline on an unreviewed call in a PARAMETER decorator (evaluated when the class is defined)', () => {
    // Review finding (PR #539, review 5387082968): a parameter decorator's
    // expression is evaluated when the containing class is defined, but the
    // eager-parts walk visited decorators only on the class and its MEMBERS —
    // `class C { m(@sneakySideEffect() v: string) {} }` reached neither
    // visitDecorators(member) nor the deferred method-body walk, so the
    // unreviewed eager call passed the gate. Parameter decorators on every
    // method/accessor/constructor overload must now reach the gate.
    for (const src of [
      `class C { m(@sneakySideEffect() v: string) {} }\n`,
      `class C { constructor(@sneakySideEffect() v: string) {} }\n`,
      `class C { get g(@sneakySideEffect() v: string) { return 1; } }\n`,
      `class C { set s(@sneakySideEffect() v: string) {} }\n`,
      `class C { static m(@sneakySideEffect() v: string) {} }\n`,
      `export const C = class { m(@sneakySideEffect() v: string) {} };\n`,
    ]) {
      const { result } = runHook({ 'evil.gen.ts': src });
      expect(result.status).toBe(1);
      expect(result.stderr.toLowerCase()).toContain('sneaky');
    }
  });

  it('fails the pipeline on an unreviewed TAGGED TEMPLATE (an eager invocation that is not a CallExpression)', () => {
    // Review finding (PR #539, review 5387082968, previously-missed): a tagged
    // template IS an eager function invocation — `tag\`...\`` calls `tag` at
    // evaluation time — but it is a TaggedTemplateExpression, not a
    // CallExpression, so `export const x = sneakyTag\`value\`` was silently
    // accepted and could run an unreviewed side effect at import time. The tag
    // and every substitution are eager and must reach the gate.
    for (const src of [
      'export const x = sneakyTag`value`;\n',
      'export const x = sneakyTag`a${b}c`;\n',
      'export const x = tag`${sneakySideEffect()}`;\n',
      'export const x = tag`a${b}${sneakySideEffect()}`;\n',
      'export const x = createClient(sneakyTag`value`);\n',
    ]) {
      const { result } = runHook({ 'evil.gen.ts': src });
      expect(result.status).toBe(1);
      expect(result.stderr.toLowerCase()).toContain('sneaky');
    }
  });

  it('annotates a REVIEWED tagged template and its reviewed substitutions', () => {
    // The pure counterpart: a reviewed tag is annotated like a reviewed call,
    // and a reviewed callee in a substitution is annotated too.
    const { result, read } = runHook({
      'client.gen.ts': 'export const x = createClient`a${createConfig({ throwOnError: true })}`;\n',
    });
    expect(result.status).toBe(0);
    expect(read('client.gen.ts')).toBe(
      `export const x = ${PURE} createClient\`a\${${PURE} createConfig({ throwOnError: true })}\`;\n`
    );
  });

  it('runs AFTER the last generated-source mutator in the post-hook ordering', () => {
    // Review finding (PR #539, review 5387082968): the gate ran as
    // 650-annotate-pure-initialisers.ts, but post hooks execute in lexicographic
    // order and both 700-enrich-activate-jobs.ts and 710-derive-present-when.ts
    // rewrite files under src/gen AFTER it — so an eager initializer introduced
    // by either mutator bypassed the allowlist entirely. The gate must sort
    // after every other hook that mutates src/gen. This asserts the invariant
    // directly against the real hooks/post directory so a future mutator added
    // after the gate fails here, not in a consumer bundle.
    const postDir = join(__dirname, '..', 'hooks', 'post');
    const gate = '715-annotate-pure-initialisers.ts';
    const hooks = readdirSync(postDir)
      .filter((f) => f.endsWith('.ts'))
      .sort();
    expect(hooks).toContain(gate);
    // Hooks that only READ src/gen (test scaffolds, example typecheck) may run
    // after the gate; hooks that WRITE src/gen must run before it. Keep this
    // list empty: any new src/gen mutator must be numbered before the gate.
    const GEN_MUTATORS_AFTER_GATE: string[] = [];
    const gateIdx = hooks.indexOf(gate);
    for (const later of hooks.slice(gateIdx + 1)) {
      expect(GEN_MUTATORS_AFTER_GATE).not.toContain(later);
    }
    // And the two known mutators must sort BEFORE the gate.
    expect(hooks.indexOf('700-enrich-activate-jobs.ts')).toBeLessThan(gateIdx);
    expect(hooks.indexOf('710-derive-present-when.ts')).toBeLessThan(gateIdx);
  });
});
