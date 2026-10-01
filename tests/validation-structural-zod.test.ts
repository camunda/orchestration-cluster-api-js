import { describe, expect, it } from 'vitest';
import { z } from 'zod';
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
    expect(isZodError({ name: 'ZodError', issues: [] })).toBe(false); // not an Error
    expect(isZodError(undefined)).toBe(false);
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
