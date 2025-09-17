/**
 * Pure validation helper (no global or instance side-effects) used by ValidationManager.
 * Centralizes request/response schema validation so future callers (e.g. streaming, batch)
 * can reuse consistent semantics without depending on ValidationManager internals.
 */
import { ZodError, ZodTypeAny } from 'zod';

import { CamundaValidationError } from './errors';
import { formatValidationError, logFormattedValidation } from './formatValidation';

import type { Logger } from './logger';
import type { ValidationMode } from './validationManager';

export interface ApplySchemaValidationOptions<T = any> {
  side: 'request' | 'response';
  operationId: string; // for diagnostics
  mode: ValidationMode;
  schema?: ZodTypeAny;
  value: T;
  logger?: Logger;
}

/**
 * Applies schema validation according to the provided mode.
 *  - none: returns original value
 *  - warn: on success returns original value, on failure logs warning and returns original value
 *  - strict: returns parsed value or throws CamundaValidationError
 */
export async function applySchemaValidation<T = any>(
  opts: ApplySchemaValidationOptions<T>
): Promise<T> {
  const { side, operationId, mode, schema, value, logger } = opts;
  if (mode === 'none' || !schema) return value;
  try {
    const parsed = (schema.parseAsync ? await schema.parseAsync(value) : schema.parse(value)) as T;
    return mode === 'warn' ? value : parsed;
  } catch (err: any) {
    if (err instanceof ZodError) {
      const formatted = formatValidationError({ side, operationId, schema, value, error: err });
      if (mode === 'warn') {
        if (logger) logFormattedValidation('warn', formatted, logger);
        return value;
      }
      if (logger) logFormattedValidation('throw', formatted, logger); // will throw
      throw new CamundaValidationError({
        side,
        operationId,
        message: formatted.message,
        summary: formatted.summary,
        issues: formatted.issues,
      });
    }
    throw err;
  }
}
