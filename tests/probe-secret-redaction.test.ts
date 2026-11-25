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
    // `~2` and a trailing `~` are malformed RFC 6901 escapes, not field names.
    for (const bad of [
      ['accessKey'],
      [42],
      'accessKey',
      null,
      [''],
      ['/accessKey~2'],
      ['/accessKey~'],
      ['/a~b'],
    ]) {
      const out = redactProbeSecrets(probe({ accessKey: SECRET }, bad)) as { input: unknown };
      expect(out.input).toBe('[redacted]');
    }
  });

  it('masks the whole input of an activated probe whose secretPointers is missing', () => {
    const { secretPointers: _omitted, ...withoutPointers } = probe({ anyName: SECRET }, []);
    const out = redactProbeSecrets({ probes: [withoutPointers] }) as {
      probes: { input: unknown; probeId: string }[];
    };
    expect(out.probes[0].input).toBe('[redacted]');
    expect(out.probes[0].probeId).toBe(withoutPointers.probeId);
  });

  it('masks probes held as JSON inside a string value, at any nesting', () => {
    const inner = JSON.stringify({ probes: [probe({ anyName: SECRET }, ['/anyName'])] });
    const twice = JSON.stringify({ wrapped: inner });
    for (const value of [{ detail: inner }, { detail: twice }, [inner]]) {
      expect(JSON.stringify(redactProbeSecrets(value))).not.toContain(SECRET);
    }
  });

  it('leaves strings that are not JSON, or hold no probe, exactly as they were', () => {
    const value = { a: 'plain text', b: '{"x": 1}', c: '[1, 2]', d: '{not json' };
    expect(redactProbeSecrets(value)).toEqual(value);
  });

  it('does not treat a request-shaped body as an activated probe', () => {
    // createProbe's input is a FEEL expression that only references secrets by name.
    const body = { probeId: 'p', input: '={key: camunda.secrets.awsKey}', requestTimeout: 1000 };
    expect(redactProbeSecrets(body)).toEqual(body);
  });

  it('leaves a probe with no secrets, and unrelated bodies, readable', () => {
    const noSecrets = redactProbeSecrets(probe({ region: 'eu-west-1' }, [])) as { input: unknown };
    expect(noSecrets.input).toEqual({ region: 'eu-west-1' });
    expect(redactProbeSecrets({ input: { a: 1 }, other: [1, 'two'] })).toEqual({
      input: { a: 1 },
      other: [1, 'two'],
    });
  });

  it('masks the whole input when a pointer resolves to nothing', () => {
    // The metadata and the data disagree, so the secrets may be anywhere. A pointer that is not
    // an own key (`/__proto__`, `/constructor`) resolves to nothing too.
    for (const bad of [
      '/missing',
      '/list/5',
      '/list/-',
      '/__proto__',
      '/constructor',
      '/a%20b',
      '/cfg/k', // into a string, not an object
    ]) {
      const out = redactProbeSecrets(
        probe({ keep: 'yes', list: [SECRET], 'a b': SECRET, cfg: JSON.stringify({ k: SECRET }) }, [
          bad,
        ])
      ) as { input: unknown };
      expect(out.input).toBe('[redacted]');
    }
  });

  it('masks the whole input when input is not an object the pointers can address', () => {
    for (const input of [SECRET, JSON.stringify({ k: SECRET }), null, 7]) {
      const out = redactProbeSecrets(probe(input, ['/k'])) as { input: unknown };
      expect(out.input).toBe('[redacted]');
    }
  });

  it('masks a probe nested inside another probe input by its own pointers', () => {
    const inner = probe({ k: SECRET, other: 'visible' }, ['/k']);
    const out = JSON.stringify(redactProbeSecrets(probe({ outer: SECRET, inner }, ['/outer'])));
    expect(out).not.toContain(SECRET);
    expect(out).toContain('visible');
  });

  it('recognises an activated probe by its probeKey alone', () => {
    const out = redactProbeSecrets({ probeKey: '1', input: { anyName: SECRET } }) as {
      input: unknown;
    };
    expect(out.input).toBe('[redacted]');
  });

  it('does not reach the prototype chain', () => {
    const out = redactProbeSecrets(probe({ keep: 'yes' }, ['/__proto__'])) as { input: unknown };
    expect(out.input).toBe('[redacted]');
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('does not mutate its argument', () => {
    const original = { probes: [probe({ accessKey: SECRET }, ['/accessKey'])] };
    redactProbeSecrets(original);
    expect(original.probes[0].input).toEqual({ accessKey: SECRET });
  });
});

describe('silly-level response preview', () => {
  it('masks the input of a probe whose metadata is missing or malformed', () => {
    const { secretPointers: _omitted, ...withoutPointers } = probe({ anyName: SECRET }, []);
    for (const p of [withoutPointers, probe({ accessKey: SECRET }, ['/accessKey~2'])]) {
      const out = redactBodyPreview(JSON.stringify({ probes: [p] }), 'application/json');
      expect(out).not.toContain(SECRET);
    }
  });

  it('masks probes embedded as JSON in a string, or in a form value', () => {
    const inner = JSON.stringify({ probes: [probe({ anyName: SECRET }, ['/anyName'])] });
    const json = redactBodyPreview(JSON.stringify({ detail: inner }), 'application/json');
    const form = redactBodyPreview(
      `payload=${encodeURIComponent(inner)}`,
      'application/x-www-form-urlencoded'
    );
    expect(json).not.toContain(SECRET);
    expect(decodeURIComponent(form)).not.toContain(SECRET);
  });

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
  // The capture writer de-duplicates by operation and extras, so each call needs its own operation id.
  let captures = 0;
  const capture = (probes: unknown[]) => {
    const dir = mkdtempSync(join(tmpdir(), 'probe-capture-'));
    try {
      detectExtrasAndMaybeThrow({
        operationId: `activateProbes-${captures++}`,
        value: { probes, unexpected: true },
        schema: z.object({ probes: z.any() }),
        settings: { policy: 'warn', deep: false, captureDir: dir },
        fanatical: false,
      });
      const files = readdirSync(dir);
      expect(files).toHaveLength(1);
      return readFileSync(join(dir, files[0]), 'utf8');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };

  it('writes a capture sample without the probe secrets', () => {
    const text = capture([probe({ accessKey: SECRET, region: 'eu-west-1' }, ['/accessKey'])]);
    expect(text).not.toContain(SECRET);
    expect(text).toContain('eu-west-1');
  });

  it('masks probes embedded as JSON in a string', () => {
    const inner = JSON.stringify({ probes: [probe({ anyName: SECRET }, ['/anyName'])] });
    expect(capture([{ detail: inner }])).not.toContain(SECRET);
  });

  it('masks the input of a probe whose metadata is missing or malformed', () => {
    const { secretPointers: _omitted, ...withoutPointers } = probe({ anyName: SECRET }, []);
    expect(capture([withoutPointers])).not.toContain(SECRET);
    expect(capture([probe({ accessKey: SECRET }, ['/accessKey~2'])])).not.toContain(SECRET);
  });
});
