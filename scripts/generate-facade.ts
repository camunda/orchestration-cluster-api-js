/**
 * Facade generator: produces ergonomic CancelablePromise wrappers that
 * (a) flatten body-only operations to accept the raw body directly
 * (b) strip the transport { data } envelope so callers get the payload
 *
 * Heuristic for body-only operation flattening:
 *  - Has a requestBody
 *  - No path parameters (no parameters with in: 'path')
 *  - No query parameters (no parameters with in: 'query')
 *
 * The underlying generated functions live in src/gen/sdk.gen.ts and return a Promise
 * resolving to either { data: T, ... } or T (future-friendly). We unwrap to T and wrap
 * in a lightweight CancelablePromise providing cancel() (AbortController-based).
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import { parse } from 'yaml';

interface OA3Parameter {
  in?: string;
  name?: string;
}
interface OA3RequestBody {
  content?: Record<string, any>;
}
interface OA3Operation {
  operationId?: string;
  parameters?: OA3Parameter[];
  requestBody?: OA3RequestBody;
  summary?: string;
  description?: string;
  tags?: string[];
  ['x-eventually-consistent']?: boolean;
}
interface OA3PathItem {
  [method: string]: OA3Operation | any;
}
interface OA3Spec {
  paths?: Record<string, OA3PathItem>;
}

const ROOT = process.cwd();
const SPEC_PATH = path.resolve(ROOT, './rest-api.source.yaml');
const OUT_DIR = path.join(ROOT, 'src/facade');
const OUT_FILE = path.join(OUT_DIR, 'operations.gen.ts');
const SDK_GEN_PATH = path.join(ROOT, 'src/gen/sdk.gen.ts');

function main() {
  if (!fs.existsSync(SPEC_PATH)) {
    console.warn('[facade-gen] Spec missing, skipping');
    return;
  }
  const spec: OA3Spec = parse(fs.readFileSync(SPEC_PATH, 'utf8'));
  interface OpMeta {
    opId: string;
    summary?: string;
    description?: string;
    hasBody: boolean;
    bodyOnly: boolean;
    tags?: string[];
    eventual: boolean;
    verb: string;
  }
  const allOps: OpMeta[] = [];
  const bodyOnlyOps: OpMeta[] = [];

  // Preload underlying sdk.gen.ts to capture original JSDoc blocks so we can forward them.
  const underlyingDocs: Record<string, string> = {};
  if (fs.existsSync(SDK_GEN_PATH)) {
    const sdkSrc = fs.readFileSync(SDK_GEN_PATH, 'utf8');
    // Safer scan: find each /** ... */ then ensure the next non-whitespace chars start with export const <name>
    let idx = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const start = sdkSrc.indexOf('/**', idx);
      if (start === -1) break;
      const end = sdkSrc.indexOf('*/', start + 3);
      if (end === -1) break; // malformed
      const after = sdkSrc.slice(end + 2); // chars after */
      const leading = after.match(/^[\s\r\n]*/)?.[0] || '';
      const rest = after.slice(leading.length);
      const exportMatch = rest.match(/^export const (\w+)\s*=\s*</);
      if (exportMatch) {
        const name = exportMatch[1];
        const rawBlock = sdkSrc.slice(start, end + 2);
        // Reject if rawBlock contains code-like lines (e.g., 'client?: Client;') – indicates we spanned multiple small comments.
        if (/^\s*client\?: Client;/m.test(rawBlock) || /^\s*meta\?: Record<.*>;?/m.test(rawBlock)) {
          // skip polluted block
        } else {
          underlyingDocs[name] = rawBlock;
        }
      }
      idx = end + 2;
    }
  }

  for (const [, item] of Object.entries(spec.paths || {})) {
    for (const [verb, rawOp] of Object.entries(item)) {
      const op = rawOp as OA3Operation;
      if (!op?.operationId) continue;
      const originalId = op.operationId;
      const sanitizedId = sanitizeOpId(originalId);
      const params = (op.parameters || []) as OA3Parameter[];
      const hasPathOrQuery = params.some((pr) => pr.in === 'path' || pr.in === 'query');
      const hasBody = !!op.requestBody && hasJsonLike(op.requestBody);
      const eventual = !!(op as any)['x-eventually-consistent'];
      const meta: OpMeta = {
        opId: sanitizedId,
        summary: op.summary,
        description: op.description,
        hasBody,
        bodyOnly: !!(hasBody && !hasPathOrQuery),
        tags: op.tags,
        eventual,
        verb: verb.toLowerCase(),
      };
      (meta as any).originalOpId = originalId; // preserve for deprecated alias emission
      allOps.push(meta);
      if (meta.bodyOnly) bodyOnlyOps.push(meta);
    }
  }

  allOps.sort((a, b) => a.opId.localeCompare(b.opId));
  bodyOnlyOps.sort((a, b) => a.opId.localeCompare(b.opId));
  const passthroughOps = allOps.filter((o) => !o.bodyOnly);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const lines: string[] = [];
  lines.push('// @generated ergonomic operation wrappers');
  lines.push('// DO NOT EDIT MANUALLY – run npm run generate');
  // Import every underlying operation (body-only + passthrough)
  const importOps = allOps.map((o) => o.opId);
  lines.push(
    'import { /* underlying */ ' +
      importOps.map((o) => `${o} as _${o}`).join(', ') +
      " } from '../gen/sdk.gen';"
  );
  const anyEventual = allOps.some((o) => o.eventual);
  if (anyEventual) {
    lines.push("import { eventualPoll, ConsistencyOptions } from '../runtime/eventual';");
  }
  lines.push('');
  lines.push('// Lightweight CancelablePromise implementation (local to facade)');
  lines.push(
    'export class CancelError extends Error { constructor(){ super("Cancelled"); this.name = "CancelError"; } }'
  );
  lines.push('export interface CancelablePromise<T> extends Promise<T> { cancel(): void }');
  lines.push(
    'export function toCancelable<T>(factory:(signal:AbortSignal)=>Promise<T>): CancelablePromise<T> {'
  );
  lines.push('  const ac = new AbortController();');
  lines.push('  let inner = factory(ac.signal);');
  lines.push('  const wrapped: any = new Promise<T>((resolve, reject) => {');
  lines.push('    inner.then(resolve, reject);');
  lines.push('  });');
  lines.push('  wrapped.cancel = () => { ac.abort(); };');
  lines.push('  return wrapped as CancelablePromise<T>;');
  lines.push('}');
  lines.push('');
  lines.push('// Helper conditional types to derive the success payload of the underlying call');
  lines.push('type _RawReturn<F> = F extends (...a:any)=>Promise<infer R> ? R : never;');
  lines.push('// Exclude undefined so success payload types are always concrete (errors throw)');
  lines.push(
    'type _DataOf<F> = Exclude<_RawReturn<F> extends { data: infer D } ? D : _RawReturn<F>, undefined>;'
  );
  lines.push('');

  // Body-only operations: provide typed overload (raw body OR full options)
  for (const op of bodyOnlyOps) {
    // Derive body type & overloads first
    lines.push(`type _${op.opId}_Options = Parameters<typeof _${op.opId}>[0];`);
    lines.push(
      `type _${op.opId}_MaybeBody = _${op.opId}_Options extends { body?: infer B } ? B : never;`
    );
    lines.push(
      `type _${op.opId}_Body = [ _${op.opId}_MaybeBody ] extends [never] ? unknown : _${op.opId}_MaybeBody;`
    );
    const jsdoc = forwardJsDoc(op, underlyingDocs);
    if (jsdoc) {
      if (op.eventual) {
        const inject = jsdoc.replace(
          /\*\/$/,
          ' *\n * Consistency: Eventually consistent – may return 404/empty until propagation.\n */'
        );
        lines.push(inject);
      } else lines.push(jsdoc);
    }
    if (op.eventual) {
      // Eventually consistent body-only operation: single signature (body + consistency opts)
      lines.push(
        `export function ${op.opId}(body: _${op.opId}_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _${op.opId}>> }): CancelablePromise<_DataOf<typeof _${op.opId}>> {`
      );
      lines.push(
        `  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');`
      );
      lines.push(
        `  const invoke = () => toCancelable(signal => _${op.opId}({ body, signal } as any).then((r:any)=> r?.data ?? r));`
      );
      lines.push(
        `  return eventualPoll('${(op as any).originalOpId}', ${op.verb === 'get'}, invoke, ec.consistency);`
      );
      lines.push('}');
    } else {
      // Simple body-only operation: single signature accepting raw body
      lines.push(
        `export function ${op.opId}(body: _${op.opId}_Body): CancelablePromise<_DataOf<typeof _${op.opId}>> {`
      );
      lines.push(
        `  return toCancelable(signal => _${op.opId}({ body, signal } as any).then((r:any)=> r?.data ?? r));`
      );
      lines.push('}');
    }
    const original = (op as any).originalOpId;
    if (original && original !== op.opId) {
      lines.push(
        '/** @deprecated Use ' +
          op.opId +
          ' instead; legacy operationId retained for transitional compatibility. */'
      );
      lines.push(`export const ${original} = ${op.opId};`);
    }
    lines.push('');
  }

  // Passthrough wrappers for all remaining operations so users get a uniform surface
  for (const op of passthroughOps) {
    const jsdoc = forwardJsDoc(op, underlyingDocs);
    if (jsdoc) {
      if (op.eventual) {
        const inject = jsdoc.replace(
          /\*\/$/,
          ' *\n * Consistency: Eventually consistent – may return 404/empty until propagation.\n */'
        );
        lines.push(inject);
      } else lines.push(jsdoc);
    }
    if (op.eventual) {
      lines.push(
        `export function ${op.opId}(options: Parameters<typeof _${op.opId}>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _${op.opId}>> }): CancelablePromise<_DataOf<typeof _${op.opId}>> {`
      );
      lines.push(
        `  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');`
      );
      lines.push(
        `  const invoke = () => toCancelable(signal => _${op.opId}({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));`
      );
      lines.push(
        `  return eventualPoll('${(op as any).originalOpId}', ${op.verb === 'get'}, invoke, ec.consistency);`
      );
      lines.push('}');
    } else {
      lines.push(
        `export function ${op.opId}(options?: Parameters<typeof _${op.opId}>[0]): CancelablePromise<_DataOf<typeof _${op.opId}>> {`
      );
      lines.push(
        `  return toCancelable(signal => _${op.opId}({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));`
      );
      lines.push('}');
    }
    const original = (op as any).originalOpId;
    if (original && original !== op.opId) {
      lines.push(
        '/** @deprecated Use ' +
          op.opId +
          ' instead; legacy operationId retained for transitional compatibility. */'
      );
      lines.push(`export const ${original} = ${op.opId};`);
    }
    lines.push('');
  }

  if (!allOps.length) {
    lines.push('export {} // no operations found');
  }

  // --- Instrumentation: compute hash BEFORE sentinel insertion ---
  const preContent = lines.join('\n');
  const hash = crypto.createHash('sha256').update(preContent).digest('hex').slice(0, 16);
  // NOTE: lines.length under-counts actual file lines because many pushed strings (JSDoc blocks) contain embedded newlines.
  // Compute the real physical line count for accurate diagnostics.
  const physicalLineCount = preContent.split(/\n/).length; // wc -l equivalent (both count trailing sentinel line)
  lines.push(
    `// SENTINEL_FACADE_PREWRITE hash=${hash} totalWrappers=${allOps.length} elements=${lines.length} physicalLines=${physicalLineCount}`
  );
  fs.writeFileSync(OUT_FILE, preContent + '\n' + lines[lines.length - 1] + '\n', 'utf8');
  console.log(
    `[facade-gen] Wrote ${bodyOnlyOps.length} flattened + ${passthroughOps.length} passthrough wrappers (total ${allOps.length}) -> ${path.relative(ROOT, OUT_FILE)} (hash=${hash}, elements=${lines.length}, physicalLines=${physicalLineCount})`
  );

  // Greenfield: no legacy wrapper or request shims emitted.

  // Barrel export for facade operations + CamundaKey types
  try {
    const metadataPath = path.join(ROOT, 'branding/branding-metadata.json');
    let keyNames: string[] = [];
    if (fs.existsSync(metadataPath)) {
      const meta = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      if (Array.isArray(meta.keys))
        keyNames = meta.keys
          .map((k: any) => k.name)
          .filter(Boolean)
          .sort();
    } else {
      // Fallback: parse types.gen.ts heuristically
      const typesFile = path.join(ROOT, 'src/gen/types.gen.ts');
      if (fs.existsSync(typesFile)) {
        const src = fs.readFileSync(typesFile, 'utf8');
        const re = /export type (\w+) = CamundaKey<[^>]+>/g;
        let m;
        while ((m = re.exec(src))) keyNames.push(m[1]);
        keyNames = Array.from(new Set(keyNames)).sort();
      }
    }
    const barrel = [
      '// @generated facade barrel',
      "export * from '../facade/operations.gen';",
      keyNames.length
        ? 'export { ' + keyNames.join(', ') + " } from './types.gen';"
        : '//' + ' no key names found',
    ].join('\n');
    const barrelPath = path.join(ROOT, 'src/gen/facade.gen.ts');
    fs.mkdirSync(path.dirname(barrelPath), { recursive: true });
    fs.writeFileSync(barrelPath, barrel, 'utf8');
    console.log(
      `[facade-gen] Wrote barrel with ${keyNames.length} CamundaKey exports -> src/gen/facade.gen.ts`
    );
  } catch (e) {
    console.warn('[facade-gen] Barrel generation failed', e);
  }
}

function hasJsonLike(rb: OA3RequestBody): boolean {
  if (!rb?.content) return false;
  return Object.keys(rb.content).some((k) => /json|octet|multipart|text\//i.test(k));
}

function buildJsDoc(
  op: { opId: string; summary?: string; description?: string; tags?: string[] },
  originalOpId?: string
): string {
  const parts: string[] = [];
  if (op.summary) parts.push(op.summary);
  if (op.description) parts.push(...String(op.description).split(/\r?\n/));
  if (originalOpId) parts.push(`@operationId ${originalOpId}`);
  if (op.tags?.length) parts.push(`@tags ${op.tags.join(', ')}`);
  return '/**\n' + parts.map((l) => ' * ' + l.replace(/\*/g, '')).join('\n') + '\n */';
}

function forwardJsDoc(op: any, sourceMap: Record<string, string>): string {
  const base = sourceMap[op.opId];
  const originalOpId = op.originalOpId || op.opId;
  if (base) {
    const injection: string[] = [];
    injection.push(' *');
    injection.push(` * @operationId ${originalOpId}`);
    if (op.tags?.length) injection.push(` * @tags ${op.tags.join(', ')}`);
    return base.replace(/\*\/$/, injection.join('\n') + '\n */');
  }
  return buildJsDoc(op, originalOpId);
}

function sanitizeOpId(id: string): string {
  // Normalize trailing/consecutive all-caps XML tokens to Title-case Xml for alignment with sdk.gen export naming.
  return id.replace(/XML/g, 'Xml');
}

main();
