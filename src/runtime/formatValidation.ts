import { ZodError, ZodIssue, ZodTypeAny, ZodUnion, ZodObject, ZodRawShape } from 'zod';

import type { Logger } from './logger';

export interface FormattedValidation {
  message: string;
  summary: string;
  issues: string[]; // trimmed issue lines
}

// All validation output is now verbose: full issue listing (no truncation heuristic)
function identity<T>(v: T): T {
  return v;
}

function describeObjectShape(obj: ZodObject<ZodRawShape>): {
  required: string[];
  optional: string[];
} {
  const shapeObj = obj.shape;
  const required: string[] = [];
  const optional: string[] = [];
  for (const k of Object.keys(shapeObj)) {
    const { optional: isOpt } = unwrapAndDetectOptional(shapeObj[k]);
    (isOpt ? optional : required).push(k);
  }
  return { required: required.sort(), optional: optional.sort() };
}

function unwrapAndDetectOptional(s: any): { schema: any; optional: boolean } {
  let cur = s;
  let optional = false;
  const seen = new Set<any>();
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    const t = cur?._def?.typeName;
    if (t === 'ZodOptional') {
      optional = true;
      cur = cur._def.innerType;
      continue;
    }
    if (t === 'ZodDefault') {
      // default(value) implies required from caller perspective, but treat as optional keys absent? Keep as optional for discrimination heuristics.
      optional = true;
      cur = cur._def.innerType;
      continue;
    }
    if (t === 'ZodNullable') {
      cur = cur._def.innerType;
      continue;
    }
    if (t === 'ZodBranded') {
      cur = cur._def.type;
      continue;
    }
    if (t === 'ZodEffects') {
      cur = cur._def.schema;
      continue;
    }
    if (t === 'ZodLazy') {
      try {
        cur = cur._def.getter();
        continue;
      } catch {
        break;
      }
    }
    if (t === 'ZodIntersection') {
      // choose left for structural keys (both merged elsewhere earlier)
      cur = cur._def.left;
      continue;
    }
    break;
  }
  return { schema: cur, optional };
}

interface FormattedUnion {
  lines: string[];
  variantCount: number;
}
function unwrapForInspection(s: any): any {
  let cur = s;
  const seen = new Set<any>();
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    const t = cur?._def?.typeName;
    if (t === 'ZodLazy') {
      try {
        cur = cur._def.getter();
        continue;
      } catch {
        break;
      }
    }
    if (t === 'ZodEffects') {
      cur = cur._def.schema || cur;
      continue;
    }
    if (t === 'ZodBranded') {
      cur = cur._def.type || cur;
      continue;
    }
    if (t === 'ZodIntersection') {
      // unwrap intersections; merge object shapes when both sides objects
      const left = cur._def.left;
      const right = cur._def.right;
      if (left?._def?.typeName === 'ZodObject' && right?._def?.typeName === 'ZodObject') {
        try {
          const leftShapeFn = left._def.shape;
          const rightShapeFn = right._def.shape;
          const merged = { ...leftShapeFn(), ...rightShapeFn() };
          // create synthetic object for inspection only
          return (ZodObject as any).create(merged);
        } catch {
          /* ignore */
        }
      }
      cur = left;
      continue;
    }
    break;
  }
  return cur;
}
function formatUnion(schema: any): FormattedUnion | undefined {
  if (!(schema?._def?.typeName === 'ZodUnion')) return undefined;
  const u: ZodUnion<any> = schema;
  const variants: ZodTypeAny[] = (u as any)._def.options as any[];
  const requiredSets: string[][] = [];
  const variantLines = variants.map((v, i) => {
    const resolved = unwrapForInspection(v);
    const label = v.description || resolved.description || `Variant ${i + 1}`;
    if (resolved?._def?.typeName === 'ZodObject') {
      const { required, optional } = describeObjectShape(resolved as any);
      requiredSets.push(required.slice());
      let line = `${label}: required { ${required.join(', ') || '(none)'} } optional { ${optional.slice(0, 6).join(', ')}${optional.length > 6 ? '…' : ''} }`;
      const example: Record<string, any> = {};
      required.forEach((k) => (example[k] = '<value>'));
      line += ` example ${JSON.stringify(example)}`;
      return line;
    }
    requiredSets.push([]);
    return `${label}: ${resolved?._def?.typeName || 'unknown'} schema`;
  });
  const lines: string[] = [];
  if (variants.length > 1) {
    const signatures = requiredSets.map((s) => (s.length ? s.join('+') : '(none)')).join(' | ');
    lines.push(`Exactly one of the variant required-key sets must match: ${signatures}`);
  }
  lines.push(...variantLines);
  return { lines, variantCount: variants.length };
}

export function formatValidationError(params: {
  side: 'request' | 'response';
  operationId?: string;
  schemaName?: string;
  schema?: ZodTypeAny;
  value?: any;
  error: ZodError;
}): FormattedValidation {
  const { side, operationId, schemaName, schema, value, error } = params;
  const prefix = `Invalid ${operationId ? operationId + ' ' : ''}${side}`.trim();
  const providedKeys =
    value && typeof value === 'object' && !Array.isArray(value) ? Object.keys(value) : [];
  let union: FormattedUnion | undefined;
  // detect union top-level
  const firstIssue = error.issues[0];
  if (firstIssue?.code === 'invalid_union') {
    union = formatUnion(schema);
  }
  const allIssueLines = error.issues.map(formatIssue);
  const issueLines = identity(allIssueLines);
  const summaryParts = [
    union ? `${union.variantCount} variant(s) defined; none matched.` : undefined,
    providedKeys.length ? `provided keys: { ${providedKeys.join(', ')} }` : undefined,
  ].filter(Boolean);
  const summary = summaryParts.join(' ');
  const message = `${prefix}${schemaName ? ' (' + schemaName + ')' : ''}: ${union ? 'no union variant matched' : 'validation failed'}`;
  const issues = [...(union?.lines || []), ...issueLines];
  return { message, summary, issues };
}

function formatIssue(issue: ZodIssue): string {
  const i: any = issue; // relax typing (Zod internal issue codes may expand across versions)
  const p = i.path?.length ? i.path.join('.') : '(root)';
  switch (i.code) {
    case 'invalid_type':
      return `${p}: expected ${i.expected} got ${i.received}`;
    case 'invalid_literal':
      return `${p}: expected literal ${JSON.stringify(i.expected)}`;
    case 'invalid_union':
      return `${p}: union mismatch`;
    case 'too_small':
    case 'too_big':
      return `${p}: ${i.message}`;
    case 'unrecognized_keys':
      return `${p}: unrecognized keys ${i.keys.join(', ')}`;
    case 'invalid_enum_value':
      return `${p}: expected one of ${i.options.join(', ')}`;
    default:
      return `${p}: ${i.message}`;
  }
}

export function logFormattedValidation(
  kind: 'warn' | 'throw',
  formatted: FormattedValidation,
  logger: Logger
) {
  const vLogger = logger.scope('validation');
  if (kind === 'warn') {
    vLogger.warn(
      () =>
        `${formatted.message}\n  ${formatted.summary}\n  Issues:\n   - ${formatted.issues.join('\n   - ')}`
    );
    return;
  }
  vLogger.error(() => `${formatted.message}\n  ${formatted.summary}`);
  const err = new Error(formatted.message);
  (err as any).issues = formatted.issues;
  throw err;
}
