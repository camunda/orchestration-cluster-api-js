import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Postprocess: enrich activateJobs with action methods & adjust signature.
 *
 * The operation body lives in the standalone function in `operations.gen.ts` (which
 * CamundaClient.activateJobs delegates to), so the enrichment is injected there. The
 * return-type adjustment applies to both the function and the class method
 * declarations. `head` is the declaration prefix up to the input parameter.
 */
function patchFile(
  filePath: string,
  opts: {
    head: string;
    requiredJobActionsNames: string[];
    importAnchor: RegExp;
    injectEnrichment: boolean;
  }
) {
  let src = readFileSync(filePath, 'utf8');
  const alreadyInjected = /enrichActivatedJob\(/.test(src);
  const head = opts.head;
  const headRe = head.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Insert/merge the jobActions import. On a freshly generated file there is no
  // such import, so we add it after the jobWorker import for stability. On an
  // incremental rerun against an already-patched file the import may already
  // exist but predate a symbol this hook now needs — MERGE the required names
  // into the existing import rather than skipping.
  //
  // Limit this list to the symbols THIS hook ALWAYS emits: `enrichActivatedJob`
  // (spliced into the implementation below) and `EnrichedActivatedJob` (the
  // adjusted `activateJobs` return type). The narrowing companion
  // `EnrichedActivatedJobOf` is imported by hook 710 ONLY when it actually emits
  // narrowed overloads that reference it. Importing it unconditionally here would
  // leave it unused for a spec with no `x-present-when` markers (hook 710 returns
  // early), tripping Biome's `noUnusedImports` and failing the build.
  const requiredJobActionsNames = opts.requiredJobActionsNames;
  const jobActionsImportRe = /import \{([^}]*)\} from '\.\.\/runtime\/jobActions';/;
  const existingJobActionsImport = src.match(jobActionsImportRe);
  if (existingJobActionsImport) {
    const names = new Set(
      existingJobActionsImport[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
    for (const n of requiredJobActionsNames) names.add(n);
    src = src.replace(
      existingJobActionsImport[0],
      `import { ${[...names].join(', ')} } from '../runtime/jobActions';`
    );
  } else {
    const before = src;
    src = src.replace(
      opts.importAnchor,
      (m) => `${m}\nimport { ${requiredJobActionsNames.join(', ')} } from '../runtime/jobActions';`
    );
    if (src === before) throw new Error(`jobActions import anchor not found in ${filePath}`);
  }

  // Adjust declaration signature (handle optional options param)
  const enrichedDecl = `${head}input: activateJobsInput, options?: OperationOptions): CancelablePromise<{ jobs: EnrichedActivatedJob[] }>;`;
  if (!src.includes(enrichedDecl)) {
    const original = src;
    src = src.replace(
      new RegExp(`${headRe}input: activateJobsInput[^)]*\\): CancelablePromise<[^;\\n]+>;`),
      () => enrichedDecl
    );
    if (src === original) throw new Error(`activateJobs declaration not found in ${filePath}`);
  }

  // Inject enrichment logic inside implementation before returning data
  if (opts.injectEnrichment && !alreadyInjected) {
    // Anchor on the implementation signature — note the trailing ` {`. Without it the
    // match can land on an overload/declaration line (which ends in `;`), and the
    // splice below would then hit some other operation's body.
    const implStart = src.indexOf(
      `${head}arg: any, options?: OperationOptions): CancelablePromise<any> {`
    );
    if (implStart === -1) throw new Error(`activateJobs implementation not found in ${filePath}`);
    {
      const slice = src.slice(implStart);
      // Anchor on the FIRST `return data;` after the implementation signature. Later
      // hooks (e.g. 710's present-when guards) splice their own statements ABOVE this
      // final return, so the enrichment lands after them and wraps every success path.
      const returnPos = slice.indexOf('return data;');
      if (returnPos !== -1) {
        const before = src.slice(0, implStart) + slice.slice(0, returnPos);
        const after = slice.slice(returnPos + 'return data;'.length);
        // A CamundaClient (the class delegates here with `this`) is passed through
        // unchanged, so job actions call its methods exactly as before. A bare
        // CamundaCore gets an adapter routing the actions to the standalone functions.
        // The adapter is computed once per response (not per job): for a bare core it
        // allocates five closures, so building it inside `map` would multiply that by
        // the batch size for no benefit — it captures only `core`, never the job.
        // Skip the enrichment ONLY for an empty `jobs` array — the common polling result.
        // `_jobActionsClient(core)` on a bare core allocates the adapter object and five
        // closures (and on a client performs five method checks) even though `map` over an
        // empty array never runs, so skip adapter creation when there is nothing to enrich.
        // The guard gates ONLY the empty-array case (`Array.isArray(data.jobs) &&
        // data.jobs.length === 0`) and is NEGATED, so EVERY other value falls through to
        // `.map()`: a non-empty real array is enriched, and a truthy NON-ARRAY `jobs`
        // (a malformed response) reaches `.map`, where `.map is not a function` throws a
        // TypeError — preserving the previous unconditional `.map()` behavior that
        // surfaced malformed data instead of returning a value that violates the declared
        // response type. The inverse form (requiring `Array.isArray(...) && length > 0` to
        // ENTER the map) is WRONG: a truthy non-array fails that test, skips the map, and
        // is returned silently — the opposite of the invariant.
        // NOTE: the `if (data && data.jobs) {` … `data.jobs = data.jobs.map(` shape is
        // a splice anchor for hook 710's present-when guards — keep it verbatim.
        const inject = `if (data && data.jobs) { if (!(Array.isArray(data.jobs) && data.jobs.length === 0)) { const _client = _jobActionsClient(core); data.jobs = data.jobs.map((j: any) => enrichActivatedJob(j, _client, core.logger().scope(\`job:${'$'}{j.jobKey}\`))); } }\n      return data;`;
        src = before + inject + after;
      }
    }
  }

  if (opts.injectEnrichment && !src.includes('function _jobActionsClient(')) {
    src += `
/** Client view used by enriched jobs' action methods (complete, fail, error, cancel, update). */
function _jobActionsClient(core: CamundaCore): any {
  const c = core as any;
  // Pass a client through unchanged ONLY when it implements every job action an
  // enriched job may call (complete, fail, error, cancel, update). A partial
  // CamundaCore — a subclass or test double that defines only some of them — must
  // fall through to the adapter, which routes each action to the standalone
  // function, so an enriched job never invokes a missing method.
  if (
    typeof c.completeJob === 'function' &&
    typeof c.failJob === 'function' &&
    typeof c.throwJobError === 'function' &&
    typeof c.cancelProcessInstance === 'function' &&
    typeof c.updateJob === 'function'
  ) {
    return c;
  }
  return {
    clock: core.clock,
    logger: (scope?: string) => core.logger(scope),
    completeJob: (input: any, options?: OperationOptions) => completeJob(core, input, options),
    failJob: (input: any, options?: OperationOptions) => failJob(core, input, options),
    throwJobError: (input: any, options?: OperationOptions) => throwJobError(core, input, options),
    cancelProcessInstance: (input: any, options?: OperationOptions) =>
      cancelProcessInstance(core, input, options),
    updateJob: (input: any, options?: OperationOptions) => updateJob(core, input, options),
  };
}
`;
  }
  writeFileSync(filePath, src, 'utf8');
}

function main() {
  const genDir = join(process.cwd(), 'src', 'gen');
  try {
    patchFile(join(genDir, 'operations.gen.ts'), {
      head: 'export function activateJobs(core: CamundaCore, ',
      requiredJobActionsNames: ['enrichActivatedJob', 'EnrichedActivatedJob'],
      importAnchor: /import type \{ OperationOptions \} from '\.\.\/runtime\/retry';/,
      injectEnrichment: true,
    });
    patchFile(join(genDir, 'CamundaClient.ts'), {
      head: '  activateJobs(',
      requiredJobActionsNames: ['EnrichedActivatedJob'],
      importAnchor: /import \{ JobWorker, type JobWorkerConfig \} from '\.\.\/runtime\/jobWorker';/,
      injectEnrichment: false,
    });
    console.log(
      '[postprocess-activate-jobs-enrich] patched operations.gen.ts and CamundaClient.ts'
    );
  } catch (e) {
    console.error('[postprocess-activate-jobs-enrich] error', e);
    process.exitCode = 1;
  }
}

main();
