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
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { checkCompat } from '../scripts/api-compat';

const ROOT = path.resolve(__dirname, '..', '.api-compat', 'unit-tests');

const BASE = `
export declare const SPEC_HASH = "sha256:aaa";
export interface Config { url: string }
export interface Req { name: string; size?: number; mode: 'a' | 'b'; meta?: { a?: string; b?: string } }
export interface Res { id: string; note: string; hint?: string; tags: string[] }
export declare class Client {
  private secret;
  constructor(opts?: { url?: string });
  readonly config: Readonly<Config>;
  label?: string;
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
export declare class Token {
  private constructor();
  readonly value: string;
}
declare class Base {
  readonly id: string;
}
export declare class Child extends Base {
  name: string;
}
export declare function pick(x: string): string;
export declare function pick(x: number, req: Req): number;
export interface Box<T = string> { v: T }
declare class Reply {
  readonly ok: boolean;
}
export declare function reply(): Reply;
export declare const Make: new (x?: any) => object;
export declare function log(msg?: unknown): void;
export declare function parse<T>(x: T): string;
export declare function read<T = string>(): T;
interface Ticker {
  advance(ms: number): void;
  skew?: number;
}
export declare function ticker(): Ticker;
interface Job {
  complete(v: string): void;
}
export declare function work(handler: (job: Job) => void): void;
interface Sink {
  write(x: string): void;
}
export declare function attach(sink: Sink): void;
declare class Holder<T> {
  set(value: T): void;
}
export declare function holder(): Holder<number>;
interface Handler {
  (x?: unknown): void;
}
export declare function factory(): Handler;
export declare function curry(): (x?: unknown) => void;
export declare function make<T>(): void;
export interface Shape { kind: string }
export declare function within<T extends Shape>(x: T): void;
interface Internal {
  keep: number;
  hidden?: string;
}
export declare function readKeep(): Pick<Internal, 'keep'>;
// Like tsup output: an explicit export list (otherwise every declaration is exported).
export {};
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
      [
        'public constructor became private',
        edit('  code: string;\n}', '  private constructor();\n  code: string;\n}'),
        'SdkError',
      ],
      // The published class must keep its published base, not the current one.
      [
        'member inherited from an unexported base changed',
        edit('readonly id: string;', 'readonly id: string | null;'),
        'Child',
      ],
      // Parameters<> only sees the last overload.
      [
        'a non-final overload changed',
        edit('pick(x: string): string', 'pick(x: string, y: string): string'),
        'pick',
      ],
      ['generic default removed', edit('Box<T = string>', 'Box<T>'), 'Box'],
      // Unexported classes are replaced by the current ones wherever signatures use them.
      [
        'unexported class returned by a public function changed',
        edit('readonly ok: boolean;', 'readonly ok: boolean | null;'),
        'Reply',
      ],
      // `typeof` accepts a type-only export; `new Worker()` does not.
      [
        'runtime export became type-only',
        `${edit('export declare class Worker {', 'declare class Worker {')}\nexport type { Worker };`,
        'Worker',
      ],
      [
        'constructor-valued constant gained a required argument',
        edit('new (x?: any) => object', 'new (x: any) => object'),
        'Make',
      ],
      // An argument type that accepts undefined hides this from the element-type check.
      [
        'optional unknown argument became required',
        edit('log(msg?: unknown)', 'log(msg: unknown)'),
        'log',
      ],
      // Assignability ignores readonly.
      [
        'writable property became readonly',
        edit('  code: string;\n}', '  readonly code: string;\n}'),
        'SdkError',
      ],
      [
        'writable property became a getter',
        edit('  code: string;\n}', '  get code(): string;\n}'),
        'SdkError',
      ],
      // Inferred calls never pass explicit type arguments.
      ['generic parameter removed', edit('parse<T>(x: T)', 'parse(x: unknown)'), 'parse'],
      // Object literals are checked for excess properties; variables are not.
      ['request field removed', edit('size?: number; ', ''), 'run'],
      ['nested request field removed', edit('; b?: string }', ' }'), 'run'],
      // Assignability lets an optional field disappear; reading it no longer compiles.
      ['optional result field removed', edit(' hint?: string;', ''), 'run'],
      ['optional class property removed', edit('  label?: string;\n', ''), 'Client'],
      // Inferring the signature reduces T to unknown, hiding the default.
      ['generic result default changed', edit('read<T = string>', 'read<T = number>'), 'read'],
      // Methods of received objects are compared bivariantly by assignability.
      [
        'method of a returned interface narrowed',
        edit('advance(ms: number)', 'advance(ms: 0)'),
        'Ticker',
      ],
      ['optional field of a returned interface removed', edit('  skew?: number;\n', ''), 'Ticker'],
      [
        'method of a callback argument narrowed',
        edit('complete(v: string)', "complete(v: 'ok')"),
        'Job',
      ],
      // Ordinary assignability accepts these, and the types have no callable members.
      [
        'returned callable interface tightened',
        edit('(x?: unknown): void;', '(x: unknown): void;'),
        'Handler',
      ],
      [
        'returned anonymous function tightened',
        edit('curry(): (x?: unknown)', 'curry(): (x: unknown)'),
        'curry',
      ],
      // With `any` for T both parameters compare as any.
      [
        'generic class method parameter narrowed',
        edit('set(value: T): void', 'set(value: T & { id: string }): void'),
        'Holder',
      ],
      // make<any>() still compiles; make<number>() doesn't.
      ['generic constraint added', edit('make<T>()', 'make<T extends string>()'), 'make'],
      [
        'generic constraint narrowed',
        edit('within<T extends Shape>', 'within<T extends Shape & { id: string }>'),
        'within',
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
        expect.objectContaining({ symbol: 'Client', check: 'create()' })
      );
    });

    it("ignores declarations outside the entry points' directories", () => {
      const base = pkg(BASE);
      const next = pkg(BASE);
      // Something like a stale work dir or src/ in the repo root must not be read.
      fs.mkdirSync(path.join(next, 'stale'));
      fs.writeFileSync(path.join(next, 'stale', 'x.d.ts'), 'declare class Client { broken: }');
      expect(checkCompat(base, next, path.join(ROOT, `work-${n++}`)).breaks).toEqual([]);
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
      [
        'unexported returned class gained a field',
        edit('readonly ok: boolean;', 'readonly ok: boolean;\n  extra: string;'),
      ],
      [
        'writable property became an accessor pair',
        edit('  code: string;\n}', '  get code(): string;\n  set code(v: string);\n}'),
      ],
      ['readonly property became writable', edit('readonly ok: boolean;', 'ok: boolean;')],
      ['generic default added', edit('parse<T>(x: T)', 'parse<T = string>(x: T)')],
      // Customers implement Sink; the SDK calls it.
      [
        'method of an interface customers implement narrowed',
        edit('write(x: string)', "write(x: 'a')"),
      ],
      ['nested request field added', edit('b?: string }', 'b?: string; c?: string }')],
      // Pick<Internal, 'keep'> is all customers see of Internal.
      ['field outside a Pick removed', edit('  hidden?: string;\n', '')],
      ['generic constraint widened', edit('within<T extends Shape>', 'within<T extends object>')],
      [
        'generic class method parameter widened',
        edit('set(value: T): void', 'set(value: T | null): void'),
      ],
      [
        'added overload',
        edit(
          'export interface Box',
          'export declare function pick(x: boolean): boolean;\nexport interface Box'
        ),
      ],
    ];
    it.each(cases)('%s', (_label, next) => {
      expect(compare(next).breaks).toEqual([]);
    });

    it('type-only export that stays type-only', () => {
      const typeOnly = `${edit('export declare class Worker {', 'declare class Worker {')}\nexport type { Worker };`;
      expect(compare(typeOnly, typeOnly).breaks).toEqual([]);
    });
  });

  it('runs from a checkout path containing a space', () => {
    const repo = path.join(ROOT, `with space-${n++}`);
    const script = path.join(repo, 'scripts', 'api-compat.ts');
    fs.mkdirSync(path.dirname(script), { recursive: true });
    fs.copyFileSync(path.resolve(__dirname, '..', 'scripts', 'api-compat.ts'), script);
    fs.writeFileSync(path.join(repo, 'package.json'), '{"name":"fixture"}');
    const out = execFileSync(
      process.execPath,
      ['--import', 'tsx', script, '--baseline', pkg(BASE), '--current', pkg(BASE)],
      { encoding: 'utf8' }
    );
    expect(out).toContain('API compatible');
  });
});
