import type { z } from 'zod';

/**
 * Value-free projection of a schema validation failure, for logging.
 *
 * Job variables and custom headers are untrusted input: their content is set by whoever
 * started the process instance and in practice carries business payload, so it must not
 * reach logs, exception messages or telemetry.
 *
 * `ZodError.flatten()` is not value-free. Its messages embed payload-derived text — an
 * `unrecognized_keys` issue names the undeclared keys, and other codes have echoed the
 * received value in past Zod versions — and the `fieldErrors` keys are issue paths. A
 * message is a human-facing string with no stability contract, so it cannot be relied on
 * to stay value-free across a Zod upgrade.
 *
 * This projection keeps only the issue `code` and `path`, which is what a handler author
 * needs to see which field failed and how, and drops the message, the received value, the
 * expected values and the `unrecognized_keys` key list.
 *
 * Residual: a path segment is a *schema* field name for the object schemas handlers
 * normally write, but under `z.record()` the segment is a key taken from the payload.
 */
export interface ValidationIssueProjection {
  /** Zod issue code, e.g. `invalid_type`, `invalid_value`, `unrecognized_keys`. */
  code: string;
  /** Dotted issue path, e.g. `order.items[0].total`; `(root)` for a top-level issue. */
  path: string;
}

export interface ValidationFailureProjection {
  issueCount: number;
  issues: ValidationIssueProjection[];
}

/** Render a Zod issue path as a dotted/indexed string without inspecting any value. */
function formatIssuePath(path: ReadonlyArray<PropertyKey>): string {
  if (!path || path.length === 0) return '(root)';
  let out = '';
  for (const segment of path) {
    if (typeof segment === 'number') out += `[${segment}]`;
    else if (out === '') out = String(segment);
    else out += `.${String(segment)}`;
  }
  return out;
}

/**
 * Project a `ZodError` to its issue codes and paths.
 *
 * Shared by `JobWorker` and `ThreadedJobWorker` so the two cannot drift: a leak fixed in
 * one would otherwise survive in the other.
 */
export function projectValidationFailure(error: z.ZodError): ValidationFailureProjection {
  const issues = error?.issues ?? [];
  return {
    issueCount: issues.length,
    issues: issues.map((issue) => ({
      code: String(issue.code),
      path: formatIssuePath(issue.path as ReadonlyArray<PropertyKey>),
    })),
  };
}
