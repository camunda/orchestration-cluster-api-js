import { resolve as resolvePath } from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Turn a handler module reference into a specifier `import()` accepts.
 *
 * Bare specifiers (`@scope/pkg`, `my-handlers`) are passed through so normal package
 * resolution applies. Anything path-shaped is resolved against the working directory and
 * converted to a `file:` URL.
 *
 * The conversion must go through `pathToFileURL`. Hand-building the URL breaks on Windows
 * in three separate ways: `file://C:/...` puts the drive letter in the *host* rather than
 * the path, backslashes are not URL-legal and need escaping, and a bare `C:\...` handed to
 * `new URL()` parses `C:` as the scheme — which is what produces "Only URLs with a scheme
 * in: file, data, and node are supported by the default ESM loader".
 */
export function toModuleSpecifier(handlerModule: string): string {
  const isPath =
    handlerModule.startsWith('.') ||
    handlerModule.startsWith('/') ||
    /^[a-zA-Z]:[\\/]/.test(handlerModule);

  return isPath ? pathToFileURL(resolvePath(handlerModule)).href : handlerModule;
}
