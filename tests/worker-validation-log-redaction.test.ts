import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { JobWorker } from '../src/runtime/jobWorker';
import { ThreadedJobWorker } from '../src/runtime/threadedJobWorker';
import { projectValidationFailure } from '../src/runtime/validationLogging';

/**
 * Job variable content must not reach the logs when schema validation fails (#619).
 *
 * Both workers logged `ZodError.flatten()` at warn. That is not value-free: an
 * `unrecognized_keys` issue names the undeclared keys of the payload, and a message is a
 * human-facing string with no contract to stay value-free across a Zod upgrade.
 *
 * The assertions below drive both workers and both validated surfaces (variables and
 * custom headers), because the same projection has to hold everywhere a schema is applied
 * — not only in the one worker the leak was spotted in.
 */

const SECRET_VALUE = 'SNTNL-PAYLOAD-VALUE-ZQX7';
const UNDECLARED_KEY = 'sntnlUndeclaredKeyZQX7';

const inputSchema = z.object({ status: z.enum(['A', 'B']) }).strict();
const headersSchema = z.object({ mode: z.enum(['fast', 'slow']) }).strict();

function badPayload() {
  return { status: SECRET_VALUE, [UNDECLARED_KEY]: SECRET_VALUE };
}

function badHeaders() {
  return { mode: SECRET_VALUE, [UNDECLARED_KEY]: SECRET_VALUE };
}

function captureLog() {
  const events: any[] = [];
  const record =
    (level: string) =>
    (...args: any[]) => {
      events.push({ level, args: args.map((a) => (typeof a === 'function' ? a() : a)) });
    };
  const log: any = {
    level: () => 'trace',
    scope: () => log,
    silly: record('silly'),
    trace: record('trace'),
    debug: record('debug'),
    info: record('info'),
    warn: record('warn'),
    error: record('error'),
  };
  return { events, log };
}

/** Minimal client stand-in: records failJob calls, logs into `log`, performs no I/O. */
function stubClient(log: any) {
  const failed: any[] = [];
  return {
    failed,
    client: {
      logger: () => log,
      failJob: async (req: any) => {
        failed.push(req);
        return {};
      },
      activateJobs: async () => ({ jobs: [] }),
      clock: { sleep: async () => undefined, now: () => Date.now() },
      random: { next: () => 0.5 },
    } as any,
  };
}

/** Minimal thread-pool stand-in: never hands out a worker, so nothing is dispatched. */
function stubPool() {
  return {
    ready: Promise.resolve(),
    size: 1,
    busyCount: 0,
    idleCount: 0,
    onThreadReady: undefined as undefined | (() => void),
    getIdleWorker: () => undefined,
    dispatch: () => undefined,
  } as any;
}

function renderedText(events: any[]): string {
  return events
    .map((e) => `${e.level} ${e.args.map((a: any) => JSON.stringify(a) ?? String(a)).join(' ')}`)
    .join('\n');
}

describe('projectValidationFailure', () => {
  it('keeps only issue codes and paths', () => {
    const result = inputSchema.safeParse(badPayload());
    expect(result.success).toBe(false);
    if (result.success) return;

    const projection = projectValidationFailure(result.error);
    const text = JSON.stringify(projection);

    expect(text).not.toContain(SECRET_VALUE);
    expect(text).not.toContain(UNDECLARED_KEY);
    expect(projection.issueCount).toBe(result.error.issues.length);
    expect(projection.issues.map((i) => i.path)).toContain('status');
    expect(projection.issues.map((i) => i.code)).toContain('unrecognized_keys');
  });

  it('is value-free where flatten() is not', () => {
    const result = inputSchema.safeParse(badPayload());
    if (result.success) throw new Error('expected a validation failure');

    // Demonstrates the defect this guards: flatten() names the undeclared key.
    expect(JSON.stringify(result.error.flatten())).toContain(UNDECLARED_KEY);
    expect(JSON.stringify(projectValidationFailure(result.error))).not.toContain(UNDECLARED_KEY);
  });

  it('renders nested and indexed paths without reading any value', () => {
    const nested = z.object({
      order: z.object({ items: z.array(z.object({ total: z.number() })) }),
    });
    const result = nested.safeParse({ order: { items: [{ total: SECRET_VALUE }] } });
    if (result.success) throw new Error('expected a validation failure');

    const projection = projectValidationFailure(result.error);
    expect(projection.issues[0].path).toBe('order.items[0].total');
    expect(JSON.stringify(projection)).not.toContain(SECRET_VALUE);
  });
});

describe.each(['JobWorker', 'ThreadedJobWorker'] as const)(
  '%s validation failure logging',
  (name) => {
    /**
     * Constructed directly and driven through the private job-handling entry point, so the
     * test exercises validation without starting a poll loop or spawning worker threads.
     */
    function makeWorker(extra: any) {
      const { events, log } = captureLog();
      const { client, failed } = stubClient(log);
      const cfg = {
        jobType: `validation-log-${name}`,
        jobHandler: async () => undefined,
        handlerModule: '/dev/null',
        maxParallelJobs: 1,
        pollIntervalMs: 10_000,
        validateSchemas: true,
        autoStart: false,
        ...extra,
      };
      const worker: any =
        name === 'JobWorker'
          ? new JobWorker(client, cfg as any)
          : new ThreadedJobWorker(client, stubPool(), cfg as any);
      return { worker, events, failed };
    }

    it('does not log variable content when the input schema rejects the payload', async () => {
      const { worker, events, failed } = makeWorker({ inputSchema });

      await worker._handleJob({
        jobKey: '1',
        retries: 3,
        variables: badPayload(),
        customHeaders: {},
      });
      await new Promise((r) => setTimeout(r, 0));

      const text = renderedText(events);
      expect(text, 'a validation failure must still be reported').toContain(
        'job.validation.variables.failed'
      );
      expect(text, 'the received variable value reached the log').not.toContain(SECRET_VALUE);
      expect(text, 'an undeclared variable name reached the log').not.toContain(UNDECLARED_KEY);
      expect(failed.length).toBe(1);
    });

    it('does not log header content when the custom-headers schema rejects the payload', async () => {
      const { worker, events, failed } = makeWorker({ customHeadersSchema: headersSchema });

      await worker._handleJob({
        jobKey: '2',
        retries: 3,
        variables: {},
        customHeaders: badHeaders(),
      });
      await new Promise((r) => setTimeout(r, 0));

      const text = renderedText(events);
      expect(text).toContain('job.validation.headers.failed');
      expect(text, 'the received header value reached the log').not.toContain(SECRET_VALUE);
      expect(text, 'an undeclared header name reached the log').not.toContain(UNDECLARED_KEY);
      expect(failed.length).toBe(1);
    });
  }
);
