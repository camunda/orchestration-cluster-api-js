import { describe, expect, it } from 'vitest';
import {
  type ExampleRef,
  extractRegionFromContent,
  injectExamples,
} from '../hooks/post/450-inject-examples';

// ── extractRegionFromContent ────────────────────────────────────────────

describe('extractRegionFromContent', () => {
  it('extracts a region and strips common indentation', () => {
    const content = ['//#region Foo', '  const x = 1;', '  const y = 2;', '//#endregion Foo'].join(
      '\n'
    );
    expect(extractRegionFromContent(content, 'Foo')).toBe('const x = 1;\nconst y = 2;');
  });

  it('strips all CR characters from CRLF source (no stray \\r in output)', () => {
    // Simulates Windows CRLF where the region boundary falls \r|\n
    const content = '//#region Test\r\n  doStuff();\r\n//#endregion Test\r\n';
    const result = extractRegionFromContent(content, 'Test')!;
    expect(result).not.toContain('\r');
    expect(result).toBe('doStuff();');
  });

  it('handles region whose last line is immediately before \\r\\n endregion', () => {
    // This is the exact pattern that caused the \r\r\n bug:
    // The slice boundary lands between \r and \n of the endregion line
    const content = '//#region R\r\n' + '  code();\r\n' + '//#endregion R\r\n';
    const result = extractRegionFromContent(content, 'R')!;
    expect(result).toBe('code();');
    expect(result).not.toContain('\r');
  });

  it('does not match a prefix region name (e.g. Foo vs FooBar)', () => {
    const content = [
      '//#region FooBar',
      '  bar();',
      '//#endregion FooBar',
      '//#region Foo',
      '  foo();',
      '//#endregion Foo',
    ].join('\n');
    expect(extractRegionFromContent(content, 'Foo')).toBe('foo();');
  });

  it('returns null for a missing region', () => {
    expect(extractRegionFromContent('some content', 'Missing')).toBeNull();
  });
});

// ── injectExamples ──────────────────────────────────────────────────────

describe('injectExamples', () => {
  const makeResolver = (regions: Record<string, string>) => (_file: string, region: string) =>
    regions[region] ?? null;

  it('wraps injected code in fenced ```ts blocks', () => {
    const src = ['  /**', '   * Does stuff.', '   * @operationId doStuff', '   */'].join('\n');
    const map: Record<string, ExampleRef[]> = {
      doStuff: [{ file: 'test.ts', region: 'DoStuff', label: 'Do stuff example' }],
    };
    const resolve = makeResolver({ DoStuff: 'await doStuff();' });
    const { output, injectedCount } = injectExamples(src, map, resolve);

    expect(injectedCount).toBe(1);
    expect(output).toContain('```ts');
    expect(output).toContain('await doStuff();');
    // Verify the fence structure: @example line, opening fence, code, closing fence
    const lines = output.split('\n');
    const exIdx = lines.findIndex((l) => l.includes('@example Do stuff'));
    expect(exIdx).toBeGreaterThan(-1);
    expect(lines[exIdx + 1]).toMatch(/\s*\*\s*```ts/);
    expect(lines[exIdx + 2]).toMatch(/\s*\*\s*await doStuff\(\);/);
    expect(lines[exIdx + 3]).toMatch(/\s*\*\s*```/);
  });

  it('produces no \\r\\r\\n sequences when source uses CRLF', () => {
    const src =
      '  /**\r\n' + '   * Does stuff.\r\n' + '   * @operationId doStuff\r\n' + '   */\r\n';
    const map: Record<string, ExampleRef[]> = {
      doStuff: [{ file: 'test.ts', region: 'DoStuff', label: 'Example' }],
    };
    const resolve = makeResolver({ DoStuff: 'code();' });
    const { output } = injectExamples(src, map, resolve);

    expect(output).not.toMatch(/\r\r/);
    expect(output).toContain('```ts');
  });

  it('wraps {@includeCode} replacements in fenced blocks', () => {
    const src = [
      '  /**',
      '   * @example Manual example',
      '   * {@includeCode examples/test.ts#DoStuff}',
      '   */',
      '  function manualOp() {}',
    ].join('\n');
    const resolve = makeResolver({ DoStuff: 'included();' });
    const { output, injectedCount } = injectExamples(src, {}, resolve);

    expect(injectedCount).toBe(1);
    expect(output).toContain('```ts');
    expect(output).toContain('included();');
    expect(output).toContain('```');
    expect(output).not.toContain('{@includeCode');
  });

  it('wraps {@includeCode} in fenced blocks with CRLF source', () => {
    const src =
      '  /**\r\n' +
      '   * @example Manual\r\n' +
      '   * {@includeCode examples/f.ts#R}\r\n' +
      '   */\r\n' +
      '  function op() {}\r\n';
    const resolve = makeResolver({ R: 'line1();\nline2();' });
    const { output } = injectExamples(src, {}, resolve);

    expect(output).not.toMatch(/\r\r/);
    expect(output).toContain('```ts');
    expect(output).not.toContain('{@includeCode');
  });

  it('is idempotent: re-running strips and re-injects cleanly', () => {
    const src = ['  /**', '   * Does stuff.', '   * @operationId doStuff', '   */'].join('\n');
    const map: Record<string, ExampleRef[]> = {
      doStuff: [{ file: 'test.ts', region: 'DoStuff', label: 'Example' }],
    };
    const resolve = makeResolver({ DoStuff: 'code();' });
    const { output: first } = injectExamples(src, map, resolve);
    const { output: second } = injectExamples(first, map, resolve);

    expect(second).toBe(first);
  });

  it('preserves manual @example blocks not before @operationId', () => {
    const src = [
      '  /**',
      '   * @example Manual worker example',
      '   * ```ts',
      '   * const w = createWorker();',
      '   * ```',
      '   */',
      '  function createJobWorker() {}',
    ].join('\n');
    const { output } = injectExamples(src, {}, () => null);

    expect(output).toContain('@example Manual worker example');
    expect(output).toContain('createWorker()');
  });
});
