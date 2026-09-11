import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Descriptor derived from the spec's `x-present-when` marker on the
 * activateJobs 200 response. The marker is the single source of truth for the
 * request->response dependent typing; this hook only renders it.
 */
interface PresentWhenDescriptor {
  /** Top-level request field whose value governs presence (e.g. `withLease`). */
  requestField: string;
  /** Scalar literal the request field must equal for the property to be present. */
  equals: boolean | string | number;
  /** Response property that is present/absent (e.g. `leaseToken`). */
  property: string;
}

const BUNDLE_PATH = join(process.cwd(), 'external-spec', 'bundled', 'rest-api.bundle.json');

function resolveRef(spec: any, node: any): any {
  let cur = node;
  const seen = new Set<string>();
  while (cur && typeof cur === 'object' && typeof cur.$ref === 'string') {
    if (seen.has(cur.$ref)) return cur;
    seen.add(cur.$ref);
    const parts = cur.$ref.replace(/^#\//, '').split('/');
    let target: any = spec;
    for (const p of parts) target = target?.[p];
    cur = target;
  }
  return cur;
}

/** Walk a resolved response schema (through allOf/arrays/objects) for the marker. */
function findPresentWhen(
  spec: any,
  schema: any,
  seen = new Set<any>()
): PresentWhenDescriptor | undefined {
  const node = resolveRef(spec, schema);
  if (!node || typeof node !== 'object' || seen.has(node)) return undefined;
  seen.add(node);

  if (node.properties && typeof node.properties === 'object') {
    for (const [name, propSchema] of Object.entries<any>(node.properties)) {
      const resolved = resolveRef(spec, propSchema);
      const m = resolved?.['x-present-when'];
      if (m && typeof m.request === 'string' && 'equals' in m) {
        return { requestField: m.request, equals: m.equals, property: name };
      }
      const nested = findPresentWhen(spec, propSchema, seen);
      if (nested) return nested;
    }
  }
  if (node.items) {
    const nested = findPresentWhen(spec, node.items, seen);
    if (nested) return nested;
  }
  for (const key of ['allOf', 'oneOf', 'anyOf'] as const) {
    if (Array.isArray(node[key])) {
      for (const sub of node[key]) {
        const nested = findPresentWhen(spec, sub, seen);
        if (nested) return nested;
      }
    }
  }
  return undefined;
}

/** Derive the activateJobs present-when descriptor from the bundled spec. */
function deriveDescriptor(): PresentWhenDescriptor | undefined {
  let spec: any;
  try {
    spec = JSON.parse(readFileSync(BUNDLE_PATH, 'utf8'));
  } catch {
    return undefined;
  }

  for (const methods of Object.values<any>(spec.paths ?? {})) {
    for (const op of Object.values<any>(methods ?? {})) {
      if (!op || op.operationId !== 'activateJobs') continue;
      const responseSchema = op.responses?.['200']?.content?.['application/json']?.schema;
      if (!responseSchema) return undefined;
      const desc = findPresentWhen(spec, responseSchema);
      if (!desc || !desc.property) return undefined;

      // Ground-truth safety: the referenced request field must exist.
      const reqSchema = resolveRef(spec, op.requestBody?.content?.['application/json']?.schema);
      const hasField = !!reqSchema?.properties?.[desc.requestField];
      if (!hasField) {
        console.warn(
          `[postprocess-activate-jobs-enrich] x-present-when.request "${desc.requestField}" not found on the activateJobs request body; skipping lease typing.`
        );
        return undefined;
      }
      return desc;
    }
  }
  return undefined;
}

function patchCamundaClient(filePath: string) {
  let src = readFileSync(filePath, 'utf8');
  const alreadyInjected = /enrichActivatedJob\(/.test(src);
  const desc = deriveDescriptor();

  // Only boolean `equals: true` is supported today (the sole real case). A
  // string/number literal has no clean "absent" complement, so fall back to the
  // base (nullable) typing rather than emit an incorrect surface.
  const leaseTyped = desc !== undefined && desc.equals === true;
  const field = desc?.requestField ?? 'withLease';
  const prop = desc?.property ?? 'leaseToken';

  // Insert import after jobWorker import for stability
  if (!/runtime\/jobActions/.test(src)) {
    src = src.replace(
      /import { JobWorker, type JobWorkerConfig } from '..\/runtime\/jobWorker';/,
      (m) =>
        `${m}\nimport { enrichActivatedJob, EnrichedActivatedJob } from '../runtime/jobActions';`
    );
  }

  // Emit the projected element types derived from the marker. `present` is the
  // property made required non-null; `absent` removes it and forbids access.
  if (leaseTyped && !/type LeasedEnrichedActivatedJob\b/.test(src)) {
    const projected = `type LeasedEnrichedActivatedJob = EnrichedActivatedJob & { ${prop}: NonNullable<EnrichedActivatedJob['${prop}']> };\ntype UnleasedEnrichedActivatedJob = Omit<EnrichedActivatedJob, '${prop}'> & { ${prop}?: never };\n`;
    src = src.replace(
      /(import { enrichActivatedJob, EnrichedActivatedJob } from '..\/runtime\/jobActions';\n)/,
      (m) => `${m}${projected}`
    );
  }

  // Adjust declaration signature. When lease typing applies, emit three
  // overloads keyed on the request field literal; otherwise keep the single
  // (base, nullable) signature for backward compatibility.
  const baseSig =
    'activateJobs(input: activateJobsInput, options?: OperationOptions): CancelablePromise<{ jobs: EnrichedActivatedJob[] }>;';
  const overloads = leaseTyped
    ? [
        `activateJobs(input: activateJobsInput & { ${field}: true }, options?: OperationOptions): CancelablePromise<{ jobs: LeasedEnrichedActivatedJob[] }>;`,
        `activateJobs(input: activateJobsInput & { ${field}?: false | null | undefined }, options?: OperationOptions): CancelablePromise<{ jobs: UnleasedEnrichedActivatedJob[] }>;`,
        baseSig,
      ].join('\n  ')
    : baseSig;

  if (!/LeasedEnrichedActivatedJob\[]>;/.test(src)) {
    const original = src;
    src = src.replace(
      /activateJobs\(input: activateJobsInput[^)]*\): CancelablePromise<[^;\n]+>;/,
      overloads
    );
    if (src === original) {
      // Fallback pattern targeting specific _DataOf usage
      src = src.replace(
        /activateJobs\(input: activateJobsInput[^)]*\): CancelablePromise<_DataOf<[^>]+>>;/,
        overloads
      );
    }
  }

  // Inject enrichment logic (and the present-variant runtime guard) inside the
  // implementation before returning data.
  if (!alreadyInjected) {
    let implStart = src.indexOf(
      'activateJobs(arg: any, options?: OperationOptions): CancelablePromise<any>'
    );
    if (implStart === -1) {
      implStart = src.indexOf('activateJobs(arg: any): CancelablePromise<any>');
    }
    if (implStart !== -1) {
      const slice = src.slice(implStart);
      const returnPos = slice.indexOf('return data;');
      if (returnPos !== -1) {
        const before = src.slice(0, implStart) + slice.slice(0, returnPos);
        const after = slice.slice(returnPos + 'return data;'.length);
        const guard = leaseTyped
          ? ` if (arg && arg.${field} === true) { for (const j of data.jobs) { if (j.${prop} == null) { throw new Error('activateJobs was requested with ${field}: true but the server returned a job without a ${prop}. The server may predate lease support.'); } } }`
          : '';
        const inject = `if (data && data.jobs) { data.jobs = data.jobs.map((j: any) => enrichActivatedJob(j, this as any, this.logger().scope(\`job:${'$'}{j.jobKey}\`)));${guard} }\n        return data;`;
        src = before + inject + after;
      }
    }
  }

  writeFileSync(filePath, src, 'utf8');
}

function main() {
  const clientPath = join(process.cwd(), 'src', 'gen', 'CamundaClient.ts');
  try {
    patchCamundaClient(clientPath);
    console.log('[postprocess-activate-jobs-enrich] patched CamundaClient.ts');
  } catch (e) {
    console.error('[postprocess-activate-jobs-enrich] error', e);
    process.exitCode = 1;
  }
}

main();
