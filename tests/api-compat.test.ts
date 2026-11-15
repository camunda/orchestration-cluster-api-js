/*
 * Guards the API compatibility gate (scripts/api-compat.ts), which blocks stable-branch
 * PRs and releases whose public types would stop existing customer code from compiling.
 *
 * Scoped to the defect classes, not to particular SDK methods: every kind of change that
 * breaks a caller must be reported (removed export/member/entry point, new required
 * argument or field, narrowed argument, nullable or removed result field, changed
 * constructor), and every kind of compatible change must pass. The compatible cases
 * include the false positives the gate has to see through on the real SDK: private
 * members (TypeScript compares those classes nominally), SDK objects passed back as
 * arguments (e.g. fn.activateJobs(core: CamundaClient)), literal constants (SPEC_HASH),
 * and members inherited from outside the SDK.
 */
import fs from 'node:fs';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { checkCompat } from '../scripts/api-compat';

const ROOT = path.resolve(__dirname, '..', '.api-compat', 'unit-tests');

const BASE = `
export declare const SPEC_HASH = "sha256:aaa";
export interface Config { url: string }
export interface Req { name: string; size?: number; mode: 'a' | 'b' }
export interface Res { id: string; note: string; tags: string[] }
export declare class Client {
  private secret;
  constructor(opts?: { url?: string });
  readonly config: Readonly<Config>;
  create(req: Req): Promise<Res>;
  get(id: string, opts?: { fresh?: boolean }): Promise<Res>;
}
export declare class Worker {
  constructor(client: Client, cfg: { type: string });
  stop(): void;
}
export declare class SdkError extends Error {
  code: string;
}
export declare function run(core: Client, req: Req): Promise<Res>;
export declare function helper(x: number): string;
`;

let n = 0;
function pkg(dts: string, extraEntries: Record<string, string> = {}): string {
  const dir = path.join(ROOT, `pkg-${n++}`);
  fs.mkdirSync(path.join(dir, 'dist'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'dist', 'index.d.ts'), dts);
  const exportsField: Record<string, { types: string }> = { '.': { types: './dist/index.d.ts' } };
  for (const [entry, content] of Object.entries(extraEntries)) {
    const file = `./dist/${entry.replace('./', '')}.d.ts`;
    fs.writeFileSync(path.join(dir, file), content);
    exportsField[entry] = { types: file };
  }
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({ name: 'fixture', version: `0.0.${n}`, exports: exportsField })
  );
  return dir;
}

function compare(next: string, base = BASE, baseEntries = {}, nextEntries = {}) {
  return checkCompat(
    pkg(base, baseEntries),
    pkg(next, nextEntries),
    path.join(ROOT, `work-${n++}`)
  );
}

function edit(from: string, to: string): string {
  if (!BASE.includes(from)) throw new Error(`fixture edit does not apply: ${from}`);
  return BASE.replace(from, to);
}

afterAll(() => fs.rmSync(ROOT, { recursive: true, force: true }));

describe('api-compat gate', () => {
  it('passes an identical API', () => {
    const r = compare(BASE);
    expect(r.breaks).toEqual([]);
    expect(r.checked).toBeGreaterThan(10);
  });

  describe('reports changes that break callers', () => {
    const cases: Array<[string, string, string]> = [
      [
        'removed export',
        edit('export declare function helper(x: number): string;\n', ''),
        'helper',
      ],
      [
        'removed method',
        edit('  get(id: string, opts?: { fresh?: boolean }): Promise<Res>;\n', ''),
        'Client',
      ],
      [
        'new required argument',
        edit('get(id: string, opts?:', 'get(id: string, tenant: string, opts?:'),
        'Client',
      ],
      // Request-type changes are reported where a caller's code fails: on the
      // functions and methods that take the type.
      ['new required request field', edit('mode: ', 'owner: string; mode: '), 'run'],
      ['narrowed argument type', edit("mode: 'a' | 'b'", "mode: 'a'"), 'run'],
      [
        'result field became nullable (via a method)',
        edit('id: string; note', 'id: string | null; note'),
        'Client',
      ],
      ['result field became nullable', edit('id: string; note', 'id: string | null; note'), 'run'],
      ['result field became optional', edit('note: string;', 'note?: string;'), 'run'],
      ['result field removed', edit(' tags: string[] ', ' '), 'run'],
      ['removed exported type', edit('export interface Config', 'interface Config'), 'Config'],
      [
        'function gained a required argument',
        edit('helper(x: number)', 'helper(x: number, y: number)'),
        'helper',
      ],
      // Plain assignability allows this (unsoundly); the argument-tuple check must not.
      [
        'optional argument became required',
        edit('get(id: string, opts?:', 'get(id: string, opts:'),
        'Client',
      ],
      [
        'function return type widened',
        edit('helper(x: number): string', 'helper(x: number): string | number'),
        'helper',
      ],
      [
        'constructor gained a required argument',
        edit('constructor(opts?: { url?: string });', 'constructor(opts: { url: string });'),
        'Client',
      ],
      [
        'value changed kind',
        edit('export declare function helper(x: number): string;', 'export type helper = string;'),
        'helper',
      ],
    ];
    it.each(cases)('%s', (_label, next, symbol) => {
      const { breaks } = compare(next);
      expect(breaks.map((b) => b.symbol)).toContain(symbol);
    });

    it('a new required argument on a method is caught despite method bivariance', () => {
      // A whole-type check alone lets this through: TypeScript compares method
      // parameters bivariantly. The per-member arguments check must catch it.
      const { breaks } = compare(edit('create(req: Req)', 'create(req: Req & { owner: string })'));
      expect(breaks).toContainEqual(
        expect.objectContaining({ symbol: 'Client', check: 'create() arguments' })
      );
    });

    it('removed entry point', () => {
      const { breaks } = compare(BASE, BASE, { './extra': 'export declare const x: 1;' }, {});
      expect(breaks).toContainEqual(expect.objectContaining({ entry: './extra' }));
    });
  });

  describe('passes compatible changes', () => {
    const cases: Array<[string, string]> = [
      ['added export', `${BASE}\nexport declare function added(): void;`],
      ['added optional argument', edit('helper(x: number)', 'helper(x: number, y?: number)')],
      ['added optional request field', edit('size?: number;', 'size?: number; extra?: string;')],
      ['added result field', edit('tags: string[]', 'tags: string[]; created: string')],
      ['widened argument type', edit("mode: 'a' | 'b'", "mode: 'a' | 'b' | 'c'")],
      ['narrowed return type', edit('helper(x: number): string', "helper(x: number): 'ok'")],
      ['changed private member', edit('private secret;', 'private secret; private other;')],
      // The SDK object is always created by the current SDK, so its new fields are fine
      // where it is passed back in (fn facade, worker constructors).
      [
        'SDK class passed back as argument gained a field',
        edit('url: string }', 'url: string; tenant: string }'),
      ],
      ['literal constant changed', edit('"sha256:aaa"', '"sha256:bbb"')],
    ];
    it.each(cases)('%s', (_label, next) => {
      expect(compare(next).breaks).toEqual([]);
    });
  });
});
