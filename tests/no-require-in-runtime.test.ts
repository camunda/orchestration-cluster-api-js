/**
 * Regression guard (issue #537): no CommonJS `require()` in runtime source.
 *
 * The package ships ESM. tsup rewrites `require('x')` to a `__require` shim
 * that throws "Dynamic require of x is not supported" under native ESM, and
 * every such call site was wrapped in try/catch — so in ESM, mTLS, the OAuth
 * disk token cache, response-capture and the support log file were silently
 * disabled (or threw). Node built-ins must come from the `#platform` seam.
 *
 * Covers the whole class: any `require(` call in any hand-written source that
 * ends up in the published bundle, plus the template the client is generated from.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const SCAN = ['src/runtime', 'src/effect', 'src/template', 'src/facade'];
const SINGLE_FILES = readdirSync(join(root, 'src'))
  .filter((f) => f.endsWith('.ts'))
  .map((f) => join(root, 'src', f));

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : [];
  });
}

describe('runtime source', () => {
  it('contains no CommonJS require() calls', () => {
    const files = [...SCAN.flatMap((d) => walk(join(root, d))), ...SINGLE_FILES];
    const offenders: string[] = [];
    for (const file of files) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (/^\s*(\/\/|\*)/.test(line)) return; // comments
          if (/(^|[^\w.$])require\s*\(/.test(line)) {
            offenders.push(`${relative(root, file)}:${i + 1}: ${line.trim()}`);
          }
        });
    }
    expect(offenders).toEqual([]);
  });
});
