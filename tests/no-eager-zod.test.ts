import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/**
 * zod must only load when validation is enabled (issue #537).
 *
 * With validation off (the default, `req:none,res:none`) no zod code is needed at
 * runtime: generated operations `import()` their schemas only when validation is on.
 * So no module reachable through STATIC value imports from a public entry point may
 * import a value from `zod` — otherwise bundlers that cannot drop module-level imports
 * (e.g. Rollup) ship zod eagerly to every consumer.
 *
 * Class-scoped: walks the whole static import graph from every entry, so a value
 * import of zod anywhere on the eager path fails, not just the known sites.
 * Type-only imports/exports and dynamic `import()` are ignored (they cost nothing
 * at load time).
 */

const root = join(__dirname, '..');
const ENTRIES = ['src/index.ts', 'src/fn/index.ts', 'src/logger.ts'];
const PLATFORM = ['src/runtime/platform/node.ts', 'src/runtime/platform/browser.ts'];

function resolveLocal(from: string, spec: string): string[] {
  if (spec === '#platform') return PLATFORM.map((p) => join(root, p));
  if (!spec.startsWith('.')) return [];
  const base = resolve(dirname(from), spec).replace(/\.(js|ts)$/, '');
  for (const c of [`${base}.ts`, join(base, 'index.ts')]) if (existsSync(c)) return [c];
  return [];
}

/** Static value-import specifiers of a module (type-only and dynamic imports excluded). */
function valueImports(file: string): string[] {
  const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const specs: string[] = [];
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st) && ts.isStringLiteral(st.moduleSpecifier)) {
      const clause = st.importClause;
      if (clause?.isTypeOnly) continue;
      const nb = clause?.namedBindings;
      const onlyTypeNames =
        clause &&
        !clause.name &&
        nb &&
        ts.isNamedImports(nb) &&
        nb.elements.length > 0 &&
        nb.elements.every((e) => e.isTypeOnly);
      if (onlyTypeNames) continue;
      specs.push(st.moduleSpecifier.text);
    } else if (
      ts.isExportDeclaration(st) &&
      st.moduleSpecifier &&
      ts.isStringLiteral(st.moduleSpecifier) &&
      !st.isTypeOnly
    ) {
      const ec = st.exportClause;
      if (
        ec &&
        ts.isNamedExports(ec) &&
        ec.elements.length > 0 &&
        ec.elements.every((e) => e.isTypeOnly)
      )
        continue;
      specs.push(st.moduleSpecifier.text);
    }
  }
  return specs;
}

function eagerZodImporters(entry: string): string[] {
  const start = join(root, entry);
  const parent = new Map<string, string | undefined>([[start, undefined]]);
  const queue = [start];
  const offenders: string[] = [];
  while (queue.length) {
    const file = queue.shift() as string;
    for (const spec of valueImports(file)) {
      if (spec === 'zod' || spec.startsWith('zod/')) {
        const chain: string[] = [];
        for (let f: string | undefined = file; f; f = parent.get(f))
          chain.unshift(relative(root, f));
        offenders.push(chain.join(' -> '));
        continue;
      }
      for (const next of resolveLocal(file, spec)) {
        if (parent.has(next)) continue;
        parent.set(next, file);
        queue.push(next);
      }
    }
  }
  return offenders;
}

describe('zod is not loaded eagerly', () => {
  for (const entry of ENTRIES) {
    it(`${entry}: no static value import of zod on the eager path`, () => {
      expect(eagerZodImporters(entry)).toEqual([]);
    });
  }
});
