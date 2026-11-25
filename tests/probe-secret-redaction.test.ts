import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { redactProbeSecrets } from '../src/runtime/probeSecrets';
import { redactBodyPreview } from '../src/runtime/telemetry';
import { detectExtrasAndMaybeThrow } from '../src/runtime/validationExtras';

/**
 * An activated probe carries its evaluated input with the engine's secrets injected, under any
 * field name, and `secretPointers` says where. Name-based redaction cannot find them, so the
 * pointers are honoured wherever a response body is logged or captured.
 */

const SECRET = 'SNTNL-PROBE-SECRET-aaaaaaaaaaaaaaaaaaaaa-ZQX7';

const probe = (input: unknown, secretPointers: unknown) => ({
  probeKey: '2251799813685249',
  probeId: 'validate-configuration/io.camunda:aws-credential:1',
  worker: 'connectors-runtime',
  input,
  secretPointers,
});

describe('redactProbeSecrets', () => {
  it('masks the pointed values and keeps the rest of the input', () => {
    const out = redactProbeSecrets({
      probes: [probe({ region: 'eu-west-1', accessKey: SECRET }, ['/accessKey'])],
    });
    const text = JSON.stringify(out);
    expect(text).not.toContain(SECRET);
    expect(text).toContain('eu-west-1');
    expect(text).toContain('"accessKey":"[redacted]"');
  });

  it('follows nested objects and array indexes', () => {
    const out = JSON.stringify(
      redactProbeSecrets(
        probe({ auth: { tokens: ['public', SECRET] }, note: 'kept' }, ['/auth/tokens/1'])
      )
    );
    expect(out).not.toContain(SECRET);
    expect(out).toContain('public');
    expect(out).toContain('kept');
  });

  it('masks arbitrary field names, including ones that need RFC 6901 escaping', () => {
    const input = { 'a/b': SECRET, 'c~d': SECRET, 'with space': SECRET, ünï: SECRET, '': SECRET };
    const out = JSON.stringify(
      redactProbeSecrets(probe(input, ['/a~1b', '/c~0d', '/with space', '/ünï', '/']))
    );
    expect(out).not.toContain(SECRET);
  });

  it('masks a pointed container whole', () => {
    const out = JSON.stringify(
      redactProbeSecrets(probe({ creds: { id: 'x', key: SECRET } }, ['/creds']))
    );
    expect(out).not.toContain(SECRET);
    expect(out).toContain('"creds":"[redacted]"');
  });

  it('masks the whole input when the pointers cannot be trusted', () => {
    for (const bad of [['accessKey'], [42], 'accessKey', null, ['']]) {
      const out = redactProbeSecrets(probe({ accessKey: SECRET }, bad)) as { input: unknown };
      expect(out.input).toBe('[redacted]');
    }
  });

  it('leaves a probe with no secrets, and unrelated bodies, readable', () => {
    const noSecrets = redactProbeSecrets(probe({ region: 'eu-west-1' }, [])) as { input: unknown };
    expect(noSecrets.input).toEqual({ region: 'eu-west-1' });
    expect(redactProbeSecrets({ input: { a: 1 }, other: [1, 'two'] })).toEqual({
      input: { a: 1 },
      other: [1, 'two'],
    });
  });

  it('ignores a pointer to nothing and does not reach the prototype chain', () => {
    const out = redactProbeSecrets(
      probe({ keep: 'yes' }, ['/missing', '/__proto__', '/constructor'])
    ) as {
      input: Record<string, unknown>;
    };
    expect(out.input.keep).toBe('yes');
  });

  it('does not mutate its argument', () => {
    const original = { probes: [probe({ accessKey: SECRET }, ['/accessKey'])] };
    redactProbeSecrets(original);
    expect(original.probes[0].input).toEqual({ accessKey: SECRET });
  });
});

describe('silly-level response preview', () => {
  it('masks the secrets of an activateProbes response', () => {
    const body = JSON.stringify({
      probes: [probe({ region: 'eu-west-1', nested: { anyName: SECRET } }, ['/nested/anyName'])],
    });
    const out = redactBodyPreview(body, 'application/json');
    expect(out).not.toContain(SECRET);
    expect(out).toContain('eu-west-1');
  });
});

describe('validation capture', () => {
  it('writes a capture sample without the probe secrets', () => {
    const dir = mkdtempSync(join(tmpdir(), 'probe-capture-'));
    try {
      detectExtrasAndMaybeThrow({
        operationId: 'activateProbes',
        value: {
          probes: [probe({ accessKey: SECRET, region: 'eu-west-1' }, ['/accessKey'])],
          unexpected: true,
        },
        schema: z.object({ probes: z.any() }),
        settings: { policy: 'warn', deep: false, captureDir: dir },
        fanatical: false,
      });
      const files = readdirSync(dir);
      expect(files).toHaveLength(1);
      const text = readFileSync(join(dir, files[0]), 'utf8');
      expect(text).not.toContain(SECRET);
      expect(text).toContain('eu-west-1');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
