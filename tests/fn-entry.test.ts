import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CamundaClient,
  createCamundaClient,
  ProcessDefinitionKey,
  ProcessInstanceKey,
} from '../src';
import * as Fn from '../src/fn';
import * as Sdk from '../src/gen/sdk.gen';

/**
 * Per-operation functional entry point (`@camunda8/orchestration-cluster-api/fn`,
 * issue #537 phase 2b).
 *
 * Invariants, class-scoped over every operation (not a hand-picked list):
 *  - every SDK operation is exported from `./fn` as a standalone function;
 *  - the CamundaClient method of the same name is a one-line delegation to it, so
 *    the class and the function share one implementation;
 *  - every function that validates loads only its own per-operation schema module.
 */

const OPERATION_IDS = Object.keys(Sdk)
  .filter((k) => typeof (Sdk as Record<string, unknown>)[k] === 'function')
  .sort();

const root = join(__dirname, '..');
const read = (rel: string) => readFileSync(join(root, rel), 'utf8');

type Captured = { method: string; url: string; body: unknown };

function recordingFetch(respond: (url: string) => unknown = () => ({})) {
  const calls: Captured[] = [];
  const fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const req = input instanceof Request ? input : new Request(input, init);
    const text = await req.text();
    calls.push({ method: req.method, url: req.url, body: text ? JSON.parse(text) : undefined });
    return new Response(JSON.stringify(respond(req.url)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  return { calls, fetch: fetch as typeof globalThis.fetch };
}

const baseConfig = { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' };

describe('./fn entry point — class-scoped invariants', () => {
  it('exports a standalone function for every SDK operation', () => {
    expect(OPERATION_IDS.length).toBeGreaterThan(200);
    const missing = OPERATION_IDS.filter(
      (op) => typeof (Fn as Record<string, unknown>)[op] !== 'function'
    );
    expect(missing).toEqual([]);
  });

  it('every CamundaClient operation method delegates to the function of the same name', () => {
    const src = read('src/gen/CamundaClient.ts');
    const notDelegating = OPERATION_IDS.filter((op) => {
      const proto = (CamundaClient.prototype as unknown as Record<string, unknown>)[op];
      if (typeof proto !== 'function') return true;
      // The implementation signature is followed by exactly one delegation line.
      const re = new RegExp(
        `\\n  ${op}\\([^\\n]*\\): CancelablePromise<any> \\{\\n    return Ops\\.${op}\\(this(, [^\\n]*)?\\);\\n  \\}\\n`
      );
      return !re.test(src);
    });
    expect(notDelegating).toEqual([]);
  });

  it('every validating function loads only its own per-operation schema module', () => {
    const ops = read('src/gen/operations.gen.ts');
    expect(ops).not.toMatch(/_loadSchemas\(/);
    const imports = [...ops.matchAll(/import\('\.\/zod\/(\w+)\.gen'\)/g)].map((m) => m[1]);
    expect(imports.length).toBeGreaterThan(200);
    // Every schema import sits inside the function of the same operation (overload
    // signatures and the implementation together form one function's region).
    const regions = [...ops.matchAll(/^export function (\w+)\(core: CamundaCore/gm)];
    const misplaced: string[] = [];
    regions.forEach((m, i) => {
      const end = i + 1 < regions.length ? regions[i + 1].index : ops.length;
      const region = ops.slice(m.index, end);
      for (const [, target] of region.matchAll(/import\('\.\/zod\/(\w+)\.gen'\)/g)) {
        if (target !== m[1]) misplaced.push(`${m[1]} -> ${target}`);
      }
    });
    expect(misplaced).toEqual([]);
  });

  // Regression for the whole class (Copilot round 7 "previously missed"): the disclosed
  // bug affected every no-input method, but the behaviour test below exercises only
  // `getTopology`. A no-input method is one whose generated implementation binds a lone
  // first argument to an unused `arg` (`name(arg?: any, options?: OperationOptions)`);
  // every one of them must forward `options ?? arg` so a lone first argument is honoured
  // as the OperationOptions object. Asserting the delegation shape for ALL of them guards
  // the class — a method that drops the lone argument (`Ops.x(this, options)`) or binds it
  // wrongly fails here even if its behaviour test is never written.
  it('every no-input CamundaClient method forwards options ?? arg', () => {
    const src = read('src/gen/CamundaClient.ts');
    // Identify every no-input method by its implementation signature, class-scoped.
    const noInput = [
      ...src.matchAll(
        /\n {2}(\w+)\(arg\?: any, options\?: OperationOptions\): CancelablePromise<any> \{/g
      ),
    ].map((m) => m[1]);
    // Sanity: the disclosed set is the 19 no-input operations; guard against the regex
    // silently matching nothing if the generator changes the signature shape.
    expect(noInput.length).toBeGreaterThanOrEqual(19);
    const notForwarding = noInput.filter((op) => {
      const re = new RegExp(
        `\\n  ${op}\\(arg\\?: any, options\\?: OperationOptions\\): CancelablePromise<any> \\{\\n    return Ops\\.${op}\\(this, options \\?\\? arg\\);\\n  \\}\\n`
      );
      return !re.test(src);
    });
    expect(notForwarding).toEqual([]);
  });
});

describe('./fn entry point — behaviour', () => {
  it('a function on a bare core sends the same request as the client method', async () => {
    const viaFn = recordingFetch(() => ({ processInstanceKey: '1' }));
    const viaClient = recordingFetch(() => ({ processInstanceKey: '1' }));
    const core = Fn.createCamundaCore({ config: baseConfig, fetch: viaFn.fetch });
    const client = createCamundaClient({ config: baseConfig, fetch: viaClient.fetch });
    const input = {
      processDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685249'),
      variables: { a: 1 },
    };
    await Fn.createProcessInstance(core, input);
    await client.createProcessInstance(input);
    expect(viaFn.calls).toHaveLength(1);
    expect(viaFn.calls).toEqual(viaClient.calls);
  });

  it('no-input operations take options directly', async () => {
    const rec = recordingFetch(() => ({ brokers: [] }));
    const core = Fn.createCamundaCore({ config: baseConfig, fetch: rec.fetch });
    await Fn.getTopology(core, { retry: false });
    expect(rec.calls.map((c) => [c.method, new URL(c.url).pathname])).toEqual([
      ['GET', '/v2/topology'],
    ]);
  });

  // Regression for the class of bug where a no-input CamundaClient method exposes only a
  // single-argument public overload `op(options?)` but its implementation binds that lone
  // argument to an unused `arg` and forwards `options` (always undefined) — so per-call
  // options such as `{ retry: false }` were silently dropped. Every no-input class method
  // must forward a lone first argument as the OperationOptions object.
  it('a no-input class method forwards a lone options object to per-call retry', async () => {
    // Retryable on the first attempt (500 RESOURCE_EXHAUSTED), success on the second.
    const rec = (() => {
      let n = 0;
      const calls: string[] = [];
      const fetch = async (input: RequestInfo | URL) => {
        const req = input instanceof Request ? input : new Request(input);
        calls.push(req.url);
        n++;
        const body =
          n === 1
            ? { title: 'RESOURCE_EXHAUSTED', detail: 'RESOURCE_EXHAUSTED: backpressure' }
            : { brokers: [] };
        return new Response(JSON.stringify(body), {
          status: n === 1 ? 500 : 200,
          headers: { 'Content-Type': 'application/json' },
        });
      };
      return { calls, fetch: fetch as typeof globalThis.fetch };
    })();
    const client = createCamundaClient({
      config: {
        ...baseConfig,
        // Generous retry policy so that, without the override, the call would retry.
        CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS: 3,
        CAMUNDA_SDK_HTTP_RETRY_BASE_DELAY_MS: 1,
        CAMUNDA_SDK_HTTP_RETRY_MAX_DELAY_MS: 2,
      },
      fetch: rec.fetch,
    });
    // With retry disabled per-call, the retryable 500 must surface after exactly one attempt.
    await expect(client.getTopology({ retry: false })).rejects.toThrow();
    expect(rec.calls).toHaveLength(1);
  });

  it('a no-input class method works with no arguments', async () => {
    const rec = recordingFetch(() => ({ brokers: [] }));
    const client = createCamundaClient({ config: baseConfig, fetch: rec.fetch });
    await client.getTopology();
    expect(rec.calls).toHaveLength(1);
  });

  it('eventually consistent operations take consistency management like the client', async () => {
    const rec = recordingFetch(() => ({ processInstanceKey: '1' }));
    const core = Fn.createCamundaCore({ config: baseConfig, fetch: rec.fetch });
    await Fn.getProcessInstance(
      core,
      { processInstanceKey: ProcessInstanceKey.assumeExists('2251799813685249') },
      { consistency: { waitUpToMs: 0 } }
    );
    expect(new URL(rec.calls[0].url).pathname).toBe('/v2/process-instances/2251799813685249');
  });

  it('accepts a CamundaClient as the core', async () => {
    const rec = recordingFetch(() => ({ brokers: [] }));
    const client = createCamundaClient({ config: baseConfig, fetch: rec.fetch });
    await Fn.getTopology(client);
    expect(rec.calls).toHaveLength(1);
  });

  it('jobs activated through a bare core can complete themselves', async () => {
    const rec = recordingFetch((url) =>
      url.endsWith('/jobs/activation')
        ? {
            jobs: [
              {
                jobKey: '2251799813685250',
                type: 't',
                processInstanceKey: '2251799813685249',
                variables: {},
                customHeaders: {},
              },
            ],
          }
        : {}
    );
    const core = Fn.createCamundaCore({ config: baseConfig, fetch: rec.fetch });
    const { jobs } = await Fn.activateJobs(core, {
      type: 't',
      timeout: 1000,
      maxJobsToActivate: 1,
    });
    expect(jobs).toHaveLength(1);
    await jobs[0].complete({ done: true });
    expect(rec.calls.map((c) => [c.method, new URL(c.url).pathname])).toEqual([
      ['POST', '/v2/jobs/activation'],
      ['POST', '/v2/jobs/2251799813685250/completion'],
    ]);
  });

  it('validates requests with the per-operation schemas when enabled', async () => {
    const rec = recordingFetch();
    const core = Fn.createCamundaCore({
      config: { ...baseConfig, CAMUNDA_SDK_VALIDATION: 'req:strict' },
      fetch: rec.fetch,
    });
    await expect(Fn.createProcessInstance(core, { bogus: true } as never)).rejects.toThrow();
    expect(rec.calls).toHaveLength(0);
  });
});
