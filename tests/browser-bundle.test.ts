/**
 * Browser-compatibility gate (issue #537).
 *
 * Bundles every public entry point for `--platform=browser` with NO externals.
 * Any Node built-in (`node:fs`, `path`, `worker_threads`, ...) reachable from
 * an entry — statically or via dynamic `import()` / `require()` — makes esbuild
 * fail to resolve it, which fails this test. This guards the whole defect
 * class (a Node-only import on the browser module graph), not one call site.
 *
 * `#platform` is resolved through the package's real `imports` map using the
 * `browser` condition (dist paths mapped back to their `src` sources), so the
 * test also verifies the conditional wiring consumers' bundlers will see.
 */
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { build, type Plugin } from 'esbuild';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

// Map each public subpath export to its source entry.
const ENTRIES: Record<string, string> = {
  '.': 'src/index.ts',
  './logger': 'src/logger.ts',
  './effect': 'src/effect/index.ts',
};

/** Resolve a `#subpath` import the way a bundler would under the browser condition. */
function resolvePackageImport(spec: string): string | undefined {
  let target = pkg.imports?.[spec];
  // Walk condition objects: prefer `browser`, then `import`, then `default`.
  while (target && typeof target === 'object') {
    target = target.browser ?? target.import ?? target.default;
  }
  if (typeof target !== 'string') return undefined;
  // dist/<x>.js -> src/<x>.ts (unit tests run before tsup emits dist)
  return join(root, target.replace(/^\.\/dist\//, 'src/').replace(/\.c?js$/, '.ts'));
}

const packageImports: Plugin = {
  name: 'package-imports-browser',
  setup(b) {
    b.onResolve({ filter: /^#/ }, (args) => {
      const path = resolvePackageImport(args.path);
      return path
        ? { path }
        : { errors: [{ text: `package.json "imports" has no browser mapping for ${args.path}` }] };
    });
  },
};

describe('browser bundle', () => {
  it('declares every public export entry under test', () => {
    expect(Object.keys(pkg.exports).sort()).toEqual(Object.keys(ENTRIES).sort());
  });

  for (const [subpath, entry] of Object.entries(ENTRIES)) {
    it(`bundles ${subpath} for the browser without any Node built-ins`, async () => {
      const result = await build({
        entryPoints: [join(root, entry)],
        bundle: true,
        write: false,
        platform: 'browser',
        format: 'esm',
        conditions: ['browser'],
        logLevel: 'silent',
        plugins: [packageImports],
      }).catch((e: { errors?: { text: string }[] }) => ({
        errors: e.errors ?? [{ text: String(e) }],
      }));
      expect(result.errors.map((e) => e.text)).toEqual([]);
    }, 60_000);
  }
});
