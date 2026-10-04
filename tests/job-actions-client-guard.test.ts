import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Regression: the generated `_jobActionsClient` fast-path (hook 700) must only
 * pass a client through unchanged when it implements EVERY job action an enriched
 * job can call — not just `completeJob`.
 *
 * Class-of-defect: an enriched job's action methods (`complete`, `fail`, `error`,
 * `cancelWorkflow`, modify) dispatch to the client the adapter returns. If the
 * fast-path classified a partial `CamundaCore` (e.g. a subclass or test double
 * that defines only `completeJob`) as a full client and returned it unchanged,
 * a later `fail()`/`error()`/`cancelWorkflow()`/modify call would throw on a
 * missing method. So the pass-through guard must require every method the adapter
 * itself routes, keeping the two in lockstep: adding a new routed action without
 * also gating on it here re-opens the defect and fails this test.
 */
function readGenerated(): string {
  return readFileSync(join(__dirname, '..', 'src', 'gen', 'operations.gen.ts'), 'utf8');
}

/** Extract the body of the generated `_jobActionsClient(core: ...)` function. */
function jobActionsClientFn(src: string): string {
  const start = src.indexOf('function _jobActionsClient(');
  expect(start, 'generated _jobActionsClient function not found').toBeGreaterThan(-1);
  // Balance braces from the first `{` after the signature to find the function end.
  const open = src.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error('unterminated _jobActionsClient function body');
}

/**
 * Action method names the adapter routes to the standalone functions — i.e. every
 * method an enriched job may call. Derived from the adapter object literal so the
 * test tracks the real routed set rather than a hard-coded copy.
 */
function adapterRoutedActions(fnSrc: string): string[] {
  const nonActions = new Set(['clock', 'logger']);
  const names = new Set<string>();
  // Each adapter entry looks like `completeJob: (input: any, options?: ...) => ...`.
  for (const m of fnSrc.matchAll(/(\w+):\s*\(input: any/g)) {
    const name = m[1];
    if (!nonActions.has(name)) names.add(name);
  }
  return [...names];
}

describe('generated _jobActionsClient pass-through guard', () => {
  it('requires every routed job-action method before returning the client unchanged', () => {
    const fn = jobActionsClientFn(readGenerated());
    const routed = adapterRoutedActions(fn);

    // Sanity: the adapter must route the known job actions (guards against the
    // extractor silently matching nothing and vacuously passing).
    expect(routed).toEqual(
      expect.arrayContaining([
        'completeJob',
        'failJob',
        'throwJobError',
        'cancelProcessInstance',
        'updateJob',
      ])
    );

    // The pass-through fast-path must gate on EACH routed action.
    for (const method of routed) {
      expect(
        fn.includes(`typeof c.${method} === 'function'`),
        `pass-through guard must check for \`${method}\` so a partial client is not misclassified`
      ).toBe(true);
    }

    // And the fast-path must not be a single-method shortcut (the original defect).
    const guardCount = (fn.match(/typeof c\.\w+ === 'function'/g) ?? []).length;
    expect(guardCount, 'guard must verify the full action set, not a single method').toBe(
      routed.length
    );
  });
});

/**
 * Regression (Copilot round 13): the enrichment splice hoisted
 * `const _client = _jobActionsClient(core)` ahead of `data.jobs.map(...)` guarded only by
 * `if (data && data.jobs)`. An empty `jobs` array is the common polling result and is
 * truthy, so every empty bare-core poll allocated the adapter object and five closures (and
 * every client poll performed five method checks) even though `map` over an empty array
 * never runs. The adapter must be created only when there is at least one job to enrich.
 */
describe('activateJobs enrichment skips adapter creation for an empty jobs array', () => {
  it('guards _jobActionsClient(core) behind a non-empty jobs check', () => {
    const src = readGenerated();
    const enrichIdx = src.indexOf('if (data && data.jobs) {');
    expect(enrichIdx, 'activateJobs enrichment splice not found').toBeGreaterThan(-1);
    // The adapter creation must be guarded so it does not run for an empty array. The
    // guard skips ONLY the empty-array case (`!(Array.isArray(data.jobs) &&
    // data.jobs.length === 0)`) and must appear between the `if (data && data.jobs) {`
    // opener and the `_jobActionsClient(core)` call it protects.
    const clientIdx = src.indexOf('_jobActionsClient(core)', enrichIdx);
    expect(clientIdx, 'adapter creation not found after enrichment opener').toBeGreaterThan(
      enrichIdx
    );
    const between = src.slice(enrichIdx, clientIdx);
    expect(
      /!\(Array\.isArray\(data\.jobs\) && data\.jobs\.length === 0\)/.test(between),
      'adapter creation must be guarded by `!(Array.isArray(data.jobs) && data.jobs.length === 0)` so an empty poll does not allocate it'
    ).toBe(true);
  });

  // Regression (Copilot rounds 18–19, previously-missed): the empty-poll optimization first
  // guarded adapter creation with `data.jobs.length > 0` alone, then with
  // `Array.isArray(data.jobs) && data.jobs.length > 0`. BOTH positive forms gate *entry*
  // to the map, so a truthy NON-ARRAY `jobs` value (a malformed response) fails the test,
  // skips the map, and is returned silently — whereas the previous unconditional `.map()`
  // threw a TypeError on the malformed value instead of returning data that violates the
  // declared response type. The guard must skip ONLY an empty real array (a NEGATED
  // `=== 0` check) so every non-array still reaches the throwing `.map` path.
  it('restricts the empty-response optimization to actual empty arrays only', () => {
    const src = readGenerated();
    const enrichIdx = src.indexOf('if (data && data.jobs) {');
    expect(enrichIdx, 'activateJobs enrichment splice not found').toBeGreaterThan(-1);
    const clientIdx = src.indexOf('_jobActionsClient(core)', enrichIdx);
    expect(clientIdx).toBeGreaterThan(enrichIdx);
    const between = src.slice(enrichIdx, clientIdx);
    // The skip must be a NEGATED empty-array check so a non-array falls through to `.map()`.
    expect(
      /!\(Array\.isArray\(data\.jobs\) && data\.jobs\.length === 0\)/.test(between),
      'enrichment skip must be `!(Array.isArray(data.jobs) && data.jobs.length === 0)` so a malformed truthy non-array `jobs` still reaches the throwing `.map` path'
    ).toBe(true);
    // … and neither positive-entry form (either truthiness-only or `isArray && length > 0`)
    // must come back — both silently accept a truthy non-array `jobs`.
    expect(
      /data\.jobs\.length > 0/.test(between),
      'a positive `data.jobs.length > 0` entry guard silently accepts a truthy non-array `jobs` (undefined > 0 is false)'
    ).toBe(false);
  });
});
