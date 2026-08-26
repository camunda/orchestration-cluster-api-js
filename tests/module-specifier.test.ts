import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { toModuleSpecifier } from '../src/runtime/moduleSpecifier.js';

describe('toModuleSpecifier', () => {
  it('passes bare specifiers through so package resolution still applies', () => {
    expect(toModuleSpecifier('my-handlers')).toBe('my-handlers');
    expect(toModuleSpecifier('@scope/handlers')).toBe('@scope/handlers');
    expect(toModuleSpecifier('@scope/handlers/sub')).toBe('@scope/handlers/sub');
  });

  it('resolves a relative path against the working directory', () => {
    const specifier = toModuleSpecifier('./handlers/pay.js');

    expect(new URL(specifier).protocol).toBe('file:');
    expect(specifier).toBe(pathToFileURL(`${process.cwd()}/handlers/pay.js`).href);
  });

  /**
   * The regression guard for the Windows ESM-loader failure, and it runs everywhere.
   *
   * The previous implementation built the URL by hand as
   * `new URL(handlerModule, \`file://${process.cwd()}/\`)`. Given a drive-letter path,
   * `new URL` treats `C:` as the *scheme*, so the result is not a `file:` URL at all and
   * `import()` rejects it with "Only URLs with a scheme in: file, data, and node are
   * supported by the default ESM loader".
   *
   * That is observable on any platform: the assertion below is on the protocol, not on
   * the resolved path, so a POSIX CI run catches the defect too. Worth having, because
   * the SDK's own CI is Linux-only and this shipped precisely because nothing there
   * exercised a Windows path shape.
   */
  it.each(['C:\\handlers\\pay.js', 'c:/handlers/pay.js', 'D:\\a\\b\\c.mjs'])(
    'converts the Windows-shaped path %s to a file: URL',
    (winPath) => {
      const specifier = toModuleSpecifier(winPath);

      expect(() => new URL(specifier)).not.toThrow();
      expect(new URL(specifier).protocol).toBe('file:');
      expect(specifier.startsWith('file:')).toBe(true);
    }
  );

  it('produces a specifier that round-trips back to a path', () => {
    const specifier = toModuleSpecifier('./handlers/pay.js');
    expect(new URL(specifier).pathname).toContain('handlers/pay.js');
  });

  it.runIf(process.platform === 'win32')(
    'puts the drive letter in the path rather than the host',
    () => {
      const specifier = toModuleSpecifier('C:\\handlers\\pay.js');

      expect(new URL(specifier).host).toBe('');
      expect(specifier).toMatch(/^file:\/\/\/[a-zA-Z]:\//);
    }
  );

  it.runIf(process.platform !== 'win32')('handles POSIX absolute paths', () => {
    const specifier = toModuleSpecifier('/srv/handlers/pay.js');

    expect(new URL(specifier).protocol).toBe('file:');
    expect(specifier).toBe('file:///srv/handlers/pay.js');
  });
});
