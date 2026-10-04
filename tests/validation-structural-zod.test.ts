import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { $ZodError } from 'zod/v4/core';
import { CamundaValidationError } from '../src/runtime/errors';
import { applySchemaValidation, isZodError } from '../src/runtime/validationCore';
import { detectExtrasAndMaybeThrow } from '../src/runtime/validationExtras';

/**
 * The validation runtime recognises zod errors and object schemas structurally
 * (no `instanceof`, so zod is not a load-time dependency). These pin that the
 * structural checks accept exactly what the `instanceof` checks accepted.
 */

const settings = { policy: 'error' as const, deep: true };
const detect = (schema: z.ZodTypeAny, value: unknown) =>
  detectExtrasAndMaybeThrow({ operationId: 'op', value, schema, settings, fanatical: false });

describe('structural zod detection', () => {
  it('isZodError accepts zod errors (sync and async parse) and nothing else', async () => {
    const schema = z.object({ a: z.string() });
    const sync = (() => {
      try {
        schema.parse({});
      } catch (e) {
        return e;
      }
    })();
    const asyncErr = await schema.parseAsync({}).catch((e) => e);
    expect(sync).toBeInstanceOf(z.ZodError);
    expect(isZodError(sync)).toBe(true);
    expect(isZodError(asyncErr)).toBe(true);
    expect(isZodError(new Error('x'))).toBe(false);
    expect(isZodError({ name: 'OtherError', issues: [] })).toBe(false); // wrong name
    expect(isZodError({ name: 'ZodError' })).toBe(false); // no issues array
    expect(isZodError(undefined)).toBe(false);
    expect(isZodError(null)).toBe(false);
    expect(isZodError('ZodError')).toBe(false); // not an object
  });

  it('isZodError recognises zod 4 core $ZodError, which does not extend Error', () => {
    // Regression: zod 4's core `$ZodError` prototype chain ends at `Object`, so an
    // `instanceof Error` guard makes it unreachable and it would bypass formatting.
    const core = new $ZodError([{ code: 'custom', path: ['a'], message: 'bad', input: 1 }] as any);
    expect(core).not.toBeInstanceOf(Error); // the property this regression pins
    expect(core.name).toBe('$ZodError');
    expect(isZodError(core)).toBe(true);
  });

  it('strict validation turns a core $ZodError into CamundaValidationError', async () => {
    const core = new $ZodError([
      { code: 'invalid_type', path: ['a'], expected: 'string', message: 'bad', input: 1 },
    ] as any);
    const throwingSchema = {
      parse: () => {
        throw core;
      },
    } as unknown as z.ZodTypeAny;
    await expect(
      applySchemaValidation({
        side: 'request',
        operationId: 'op',
        mode: 'strict',
        schema: throwingSchema,
        value: {},
      })
    ).rejects.toBeInstanceOf(CamundaValidationError);
  });

  it('strict validation still turns zod failures into CamundaValidationError', async () => {
    await expect(
      applySchemaValidation({
        side: 'request',
        operationId: 'op',
        mode: 'strict',
        schema: z.object({ a: z.string() }),
        value: {},
      })
    ).rejects.toBeInstanceOf(CamundaValidationError);
  });

  it.each([
    ['object', z.object({ a: z.string() })],
    ['looseObject', z.looseObject({ a: z.string() })],
    ['strictObject', z.strictObject({ a: z.string() })],
    ['extended object', z.object({}).extend({ a: z.string() })],
  ])('extras are detected on %s schemas, including nested objects', (_n, schema) => {
    expect(() => detect(schema, { a: 'x', extra: 1 })).toThrow(CamundaValidationError);
    const nested = z.object({ inner: schema });
    expect(() => detect(nested, { inner: { a: 'x', extra: 1 } })).toThrow(/inner: extra/);
    expect(() => detect(schema, { a: 'x' })).not.toThrow();
  });

  it('non-object root schemas are skipped, as before', () => {
    expect(() => detect(z.string(), { extra: 1 })).not.toThrow();
    expect(() => detect(z.object({}).optional(), { extra: 1 })).not.toThrow();
    expect(() => detect(z.union([z.object({}), z.string()]), { extra: 1 })).not.toThrow();
  });
});
