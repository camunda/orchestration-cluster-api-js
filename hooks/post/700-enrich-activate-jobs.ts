import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** Postprocess: enrich activateJobs with action methods & adjust signature. */
function patchCamundaClient(filePath: string) {
  let src = readFileSync(filePath, 'utf8');
  const alreadyInjected = /enrichActivatedJob\(/.test(src);

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
  const requiredJobActionsNames = ['enrichActivatedJob', 'EnrichedActivatedJob'];
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
    src = src.replace(
      /import { JobWorker, type JobWorkerConfig } from '..\/runtime\/jobWorker';/,
      (m) => `${m}\nimport { ${requiredJobActionsNames.join(', ')} } from '../runtime/jobActions';`
    );
  }

  // Adjust declaration signature (handle optional options param)
  if (
    !/activateJobs\(input: activateJobsInput[^)]*\): CancelablePromise<{ jobs: EnrichedActivatedJob\[] }>;/.test(
      src
    )
  ) {
    const original = src;
    src = src.replace(
      /activateJobs\(input: activateJobsInput[^)]*\): CancelablePromise<[^;\n]+>;/,
      'activateJobs(input: activateJobsInput, options?: OperationOptions): CancelablePromise<{ jobs: EnrichedActivatedJob[] }>;'
    );
    if (src === original) {
      // Fallback pattern targeting specific _DataOf usage
      src = src.replace(
        /activateJobs\(input: activateJobsInput[^)]*\): CancelablePromise<_DataOf<[^>]+>>;/,
        'activateJobs(input: activateJobsInput, options?: OperationOptions): CancelablePromise<{ jobs: EnrichedActivatedJob[] }>;'
      );
    }
  }

  // Inject enrichment logic inside implementation before returning data
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
        const inject = `if (data && data.jobs) { data.jobs = data.jobs.map((j: any) => enrichActivatedJob(j, this as any, this.logger().scope(\`job:${'$'}{j.jobKey}\`))); }\n        return data;`;
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
