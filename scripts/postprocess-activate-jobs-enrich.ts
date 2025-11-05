import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/** Postprocess: enrich activateJobs with action methods & adjust signature. */
function patchCamundaClient(filePath: string) {
  let src = readFileSync(filePath, 'utf8');
  const alreadyInjected = /enrichActivatedJob\(/.test(src);

  // Insert import after jobWorker import for stability
  if (!/runtime\/jobActions/.test(src)) {
    src = src.replace(
      /import { JobWorker, type JobWorkerConfig } from '..\/runtime\/jobWorker';/,
      (m) =>
        `${m}\nimport { enrichActivatedJob, EnrichedActivatedJob } from '../runtime/jobActions';`
    );
  }

  // Adjust declaration signature
  if (
    !/activateJobs\(input: activateJobsInput\): CancelablePromise<{ jobs: EnrichedActivatedJob\[] }>;/.test(
      src
    )
  ) {
    const original = src;
    src = src.replace(
      /activateJobs\(input: activateJobsInput\): CancelablePromise<[^;\n]+>;/,
      'activateJobs(input: activateJobsInput): CancelablePromise<{ jobs: EnrichedActivatedJob[] }>;'
    );
    if (src === original) {
      // Fallback pattern targeting specific _DataOf usage
      src = src.replace(
        /activateJobs\(input: activateJobsInput\): CancelablePromise<_DataOf<[^>]+>>;/,
        'activateJobs(input: activateJobsInput): CancelablePromise<{ jobs: EnrichedActivatedJob[] }>;'
      );
    }
  }

  // Inject enrichment logic inside implementation before returning data
  if (!alreadyInjected) {
    const implStart = src.indexOf('activateJobs(arg: any): CancelablePromise<any>');
    if (implStart !== -1) {
      const slice = src.slice(implStart);
      const returnPos = slice.indexOf('return data;');
      if (returnPos !== -1) {
        const before = src.slice(0, implStart) + slice.slice(0, returnPos);
        const after = slice.slice(returnPos + 'return data;'.length);
        const inject = `if (data && data.jobs) { data.jobs = data.jobs.map((j: any) => enrichActivatedJob(j, this, this.logger().scope(\`job:${'$'}{j.jobKey}\`))); }\n        return data;`;
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
