import { ZodTypeAny } from 'zod';
import { applySchemaValidation } from './validationCore';
import { detectExtrasAndMaybeThrow } from './validationExtras';
import type { Logger } from './logger';

export type ValidationMode = 'strict' | 'warn' | 'none' | 'fanatical';

export interface ValidationSettings {
  req: ValidationMode;
  res: ValidationMode;
}

export class ValidationManager {
  private _settings: ValidationSettings;
  constructor(settings: ValidationSettings, private _logger?: Logger) { this._settings = { ...settings }; }
  update(settings: ValidationSettings) { this._settings = { ...settings }; }
  attachLogger(logger: Logger) { this._logger = logger; }
  get settings() { return this._settings; }
  requestMode() { return this._settings.req; }
  responseMode() { return this._settings.res; }

  async gateRequest(opId: string, schema: ZodTypeAny | undefined, data: any) {
    return this._gate('request', opId, this._settings.req, schema, data);
  }
  async gateResponse(opId: string, schema: ZodTypeAny | undefined, data: any) {
    return this._gate('response', opId, this._settings.res, schema, data);
  }

  private async _gate(side: 'request'|'response', opId: string, mode: ValidationMode, schema: ZodTypeAny | undefined, value: any) {
    // fanatical piggybacks on strict for core parse semantics
    const effectiveMode = (mode === 'fanatical') ? 'strict' : mode;
    const validated = await applySchemaValidation({ side, operationId: opId, mode: effectiveMode as any, schema, value, logger: this._logger });
    if (side === 'response' && mode === 'fanatical') {
      // Fanatical = strict + mandatory extras detection (error + capture)
      try {
  this._logger?.debug?.('validation.fanatical.extras', { operationId: opId });
        detectExtrasAndMaybeThrow({
          operationId: opId,
          value,
          schema,
          settings: {
            // Hard-coded fanatical semantics
            policy: 'error',
            deep: true,
            captureDir: (typeof process !== 'undefined' && process?.env?.CAMUNDA_SDK_VALIDATION_CAPTURE_DIR) || '.camunda-sdk-captures'
          },
          logger: this._logger,
          fanatical: true
        });
      } catch (e) {
        throw e; // always error for fanatical extras
      }
    }
    return validated;
  }
}
