// Pure (I/O-free) core of the DTO-driven typed variable map feature.
//
// A Zod object schema is the DTO: its keys are the exact wire variable names to query for, and
// its field shape drives validation. This mirrors the C# (reflection) and Python (Pydantic)
// SDKs while staying idiomatic to TypeScript — the SDK already depends on Zod for request and
// response validation.
//
// Keeping the paging collapse, scope-collision detection, and value deserialization free of HTTP
// makes the memory-bound behaviour directly unit-testable. The HTTP wiring lives in the client
// method `searchVariablesAsDto`, which injects a `fetchPage` callback.
import type { z } from 'zod';

/** Base class for all typed-variable errors, so callers can catch the whole family. */
export class TypedVariablesError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'TypedVariablesError';
  }
}

/**
 * Raised when a declared variable name is observed at more than one scope (for example a local
 * variable shadowing a process-level variable). The result would be ambiguous, so the search
 * fails loudly rather than silently picking one. Pass an explicit `scopeKey` to disambiguate.
 */
export class VariableScopeCollisionError extends TypedVariablesError {
  constructor(
    public readonly variableName: string,
    public readonly scopeKeys: readonly string[]
  ) {
    super(
      `Variable '${variableName}' was found at more than one scope (${scopeKeys.join(
        ', '
      )}). Pass an explicit scopeKey to disambiguate.`
    );
    this.name = 'VariableScopeCollisionError';
  }
}

/** Raised when a variable's serialized value is not valid JSON. */
export class VariableDeserializationError extends TypedVariablesError {
  constructor(
    public readonly variableName: string,
    options?: { cause?: unknown }
  ) {
    super(`Variable '${variableName}' could not be deserialized from its JSON value.`, options);
    this.name = 'VariableDeserializationError';
  }
}

/** A single variable item from a search page (the subset the collector needs). */
export interface TypedVariableItem {
  name: string;
  /** The variable value, serialized as JSON (the wire representation). */
  value: string;
  /** The scope key the variable is directly defined in. */
  scopeKey: string;
}

/** One page of variable search results. */
export interface TypedVariablePage {
  items: readonly TypedVariableItem[];
  /** Cursor for the next page, or `null` when there are no more pages. */
  endCursor: string | null;
}

/** Any Zod object schema; used as the DTO that declares the variables to fetch. */
export type AnyVariableSchema = z.ZodObject<any>;

/**
 * The declared variable names, in declaration order. These key the `name $in [...]` filter.
 *
 * Guards against non-schema inputs (e.g. a JS caller, or an `any` cast) so the failure is a clear,
 * actionable error rather than an opaque `Cannot read properties of undefined` deep in paging.
 */
export function variableNamesFromSchema(schema: AnyVariableSchema): string[] {
  const shape = schema == null ? undefined : schema.shape;
  if (shape == null || typeof shape !== 'object') {
    throw new TypedVariablesError(
      'A Zod object schema is required: its keys declare the variable names to fetch.'
    );
  }
  return Object.keys(shape);
}

/**
 * Result of a DTO-driven variable search.
 *
 * Holds the parsed variable values keyed by their declared name. Provides lenient, defensive
 * access via {@link has} / {@link get}, and a strict {@link validate} that parses the values
 * against the schema — returning a fully-typed object or throwing a `ZodError` when a required
 * variable is missing or malformed.
 */
export class VariableMap<TSchema extends AnyVariableSchema> {
  constructor(
    private readonly _raw: Readonly<Record<string, unknown>>,
    private readonly _schema: TSchema
  ) {}

  /** The parsed variable values, keyed by variable name. */
  get raw(): Readonly<Record<string, unknown>> {
    return this._raw;
  }

  /** Whether a variable with the given name is present in the result. */
  has<K extends keyof z.infer<TSchema> & string>(variableName: K): boolean;
  has(variableName: string): boolean;
  has(variableName: string): boolean {
    return Object.hasOwn(this._raw, variableName);
  }

  /**
   * Lenient access. Returns the parsed value, or `undefined` when the variable is absent.
   *
   * For a declared schema key the return type is narrowed to that field's type (still unioned
   * with `undefined`, since the variable may be absent at runtime); arbitrary string keys return
   * `unknown`.
   */
  get<K extends keyof z.infer<TSchema> & string>(variableName: K): z.infer<TSchema>[K] | undefined;
  get(variableName: string): unknown;
  get(variableName: string): unknown {
    return this.has(variableName) ? this._raw[variableName] : undefined;
  }

  /**
   * Strict access. Parses the collected values against the schema and returns the typed object.
   * Required variables must be present and well-formed, otherwise a `ZodError` is thrown.
   */
  validate(): z.infer<TSchema> {
    return this._schema.parse(this._raw);
  }
}

function parseValue(variableName: string, value: string): unknown {
  try {
    return JSON.parse(value);
  } catch (cause) {
    throw new VariableDeserializationError(variableName, { cause });
  }
}

/**
 * Incrementally collapses paged variable items into a parsed name-to-value map.
 *
 * Memory stays bounded by the DTO shape rather than the total number of paged items: only the
 * first value seen per requested name is retained, alongside the set of scope keys observed for
 * that name (used for collision detection). Items for undeclared variables are dropped, so large
 * values for variables outside the DTO are never accumulated.
 */
export class VariableCollector {
  private readonly _queryNames: Set<string>;
  private readonly _chosenValues = new Map<string, string>();
  private readonly _scopesSeen = new Map<string, Set<string>>();

  constructor(queryNames: Iterable<string>) {
    this._queryNames = new Set(queryNames);
  }

  /** Fold one page of results into the retained per-name state. */
  ingest(items: Iterable<TypedVariableItem>): void {
    for (const item of items) {
      if (!this._queryNames.has(item.name)) {
        continue;
      }
      let scopes = this._scopesSeen.get(item.name);
      if (!scopes) {
        scopes = new Set();
        this._scopesSeen.set(item.name, scopes);
      }
      scopes.add(item.scopeKey);
      if (!this._chosenValues.has(item.name)) {
        this._chosenValues.set(item.name, item.value);
      }
    }
  }

  /**
   * Parse retained values, raising on scope collisions or malformed JSON.
   * @throws {VariableScopeCollisionError} when a name was observed at more than one scope.
   * @throws {VariableDeserializationError} when a retained value is not valid JSON.
   */
  build(): Record<string, unknown> {
    const raw: Record<string, unknown> = {};
    for (const [name, value] of this._chosenValues) {
      const scopes = this._scopesSeen.get(name);
      if (scopes && scopes.size > 1) {
        throw new VariableScopeCollisionError(name, [...scopes].sort());
      }
      raw[name] = parseValue(name, value);
    }
    return raw;
  }
}

/**
 * Page through variable search results until every declared variable is found or the result set
 * is exhausted, then collapse them into a {@link VariableMap}.
 *
 * Paging terminates when: the server reports no next cursor, a page comes back empty, or a cursor
 * repeats (a defensive guard against a server that never advances). The "all declared names seen"
 * early-stop is only applied when `singleScope` is true — i.e. the query is already scoped to a
 * single scope, where each name can appear at most once. When the query spans multiple scopes,
 * stopping early on "all found" could miss the same name reappearing at a second scope on a later
 * page, silently hiding a {@link VariableScopeCollisionError}; so paging continues to exhaustion.
 *
 * The `fetchPage` callback isolates the HTTP call so the paging and collapse logic is
 * unit-testable in isolation.
 */
export async function collectTypedVariables<TSchema extends AnyVariableSchema>(params: {
  schema: TSchema;
  /** Whether the query is scoped to a single scope (collisions impossible, early-stop safe). */
  singleScope: boolean;
  fetchPage: (after: string | undefined) => Promise<TypedVariablePage>;
}): Promise<VariableMap<TSchema>> {
  const names = variableNamesFromSchema(params.schema);
  if (names.length === 0) {
    return new VariableMap({}, params.schema);
  }

  const collector = new VariableCollector(names);
  const remaining = new Set(names);
  const seenCursors = new Set<string>();
  let after: string | undefined;

  while (true) {
    const page = await params.fetchPage(after);
    collector.ingest(page.items);
    for (const item of page.items) {
      remaining.delete(item.name);
    }

    // Only safe to stop on "all found" when collisions are impossible (single scope). Otherwise
    // a later page could reveal a second scope for an already-seen name — keep paging so build()
    // can raise the collision rather than silently returning an ambiguous value.
    if (params.singleScope && remaining.size === 0) {
      break;
    }
    if (page.endCursor === null || page.items.length === 0) {
      break;
    }
    if (seenCursors.has(page.endCursor)) {
      break;
    }
    seenCursors.add(page.endCursor);
    after = page.endCursor;
  }

  return new VariableMap(collector.build(), params.schema);
}

/**
 * A cancelable in-flight request, mirroring the generated `CancelablePromise` (a `Promise` with an
 * extra `cancel()`). Kept structural here so the runtime core stays free of generated-type imports.
 */
export interface CancelableRequest<T> extends PromiseLike<T> {
  cancel(): void;
}

/** The subset of the variable search response the page fetcher reads. */
export interface VariableSearchPageResponse {
  items?: ReadonlyArray<{ name: string; value: string; scopeKey: unknown }> | null;
  page?: { endCursor?: string | null } | null;
}

/** The request input the page fetcher builds for each page. */
export interface VariableSearchPageInput<TFilter> {
  filter: TFilter;
  page: { after?: string; limit: number };
  truncateValues: boolean;
}

/**
 * Build the `fetchPage` callback for {@link collectTypedVariables} that drives the variable search
 * API. For each page it: aborts early if the outer signal is already aborted, issues the request
 * with the declared-name filter and `truncateValues: false` (full values are required to bind the
 * DTO), forwards outer cancellation to the in-flight request via its `cancel()`, and maps the raw
 * items into {@link TypedVariableItem}s.
 *
 * Transport is injected as `search`, so the input construction and cancellation propagation are
 * unit-testable without a live client.
 */
export function createVariableSearchFetchPage<TFilter>(params: {
  filter: TFilter;
  limit: number;
  signal: AbortSignal;
  search: (
    input: VariableSearchPageInput<TFilter>
  ) => CancelableRequest<VariableSearchPageResponse>;
}): (after: string | undefined) => Promise<TypedVariablePage> {
  const { filter, limit, signal, search } = params;
  return async (after) => {
    // Honour cancellation of the returned CancelablePromise between pages.
    signal.throwIfAborted();
    const input: VariableSearchPageInput<TFilter> = {
      filter,
      page: after ? { after, limit } : { limit },
      truncateValues: false,
    };
    const pending = search(input);
    // Propagate outer cancellation to the in-flight paging request so it aborts too.
    const onAbort = () => pending.cancel();
    signal.addEventListener('abort', onAbort, { once: true });
    const result = await Promise.resolve(pending).finally(() =>
      signal.removeEventListener('abort', onAbort)
    );
    const items = (result?.items ?? []).map((item) => ({
      name: item.name,
      value: item.value,
      scopeKey: String(item.scopeKey),
    }));
    return { items, endCursor: result?.page?.endCursor ?? null };
  };
}
