/*
 * Regression guard for hooks/post/650-annotate-pure-initialisers.ts (issue #537, phase 2).
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
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterAll, afterEach, describe, expect, it } from 'vitest';

const repoRoot = join(__dirname, '..');
const hook = join(repoRoot, 'hooks', 'post', '650-annotate-pure-initialisers.ts');
const PURE = '/* @__PURE__ */';

/** Every temp dir this suite created — afterEach removes the whole set. */
const created: string[] = [];
let work: string;

/** Run the hook with `cwd` = a temp dir whose src/gen contains `files`. */
function runHook(files: Record<string, string>) {
  work = mkdtempSync(join(tmpdir(), 'annotate-pure-'));
  created.push(work);
  for (const [name, body] of Object.entries(files)) {
    const p = join(work, 'src', 'gen', name);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, body);
  }
  const result = spawnSync('npx', ['tsx', hook], { cwd: work, encoding: 'utf8' });
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
// end-of-suite assertion is the regression signal that nothing leaked.
afterAll(() => {
  const leaked = created.filter((dir) => existsSync(dir));
  expect(leaked).toEqual([]);
});

describe('650-annotate-pure-initialisers', () => {
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
    // Five hook subprocesses under full-suite load exceed the 5 s default
    // timeout; the timeout is a safety net, not a correctness signal.
  }, 30_000);

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
    // Five hook subprocesses under full-suite load exceed the 5 s default
    // timeout; the timeout is a safety net, not a correctness signal.
  }, 30_000);

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
    // Five hook subprocesses under full-suite load exceed the 5 s default
    // timeout; the timeout is a safety net, not a correctness signal.
  }, 30_000);
});
