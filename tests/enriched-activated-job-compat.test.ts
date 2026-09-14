import { describe, expect, it } from 'vitest';
import type { EnrichedActivatedJob, EnrichedActivatedJobOf } from '../src';

/**
 * PR #514 review — `EnrichedActivatedJob` must remain a back-compatible public
 * INTERFACE.
 *
 * Turning it into a generic type alias (`type EnrichedActivatedJob<J> = ...`) was
 * a breaking change for downstream consumers that declaration-merge or `extends`
 * it. These are compile-time assertions (the file is type-checked by the build's
 * `typecheck` project): if the interface regresses to an alias, this stops
 * compiling. The dependent-presence narrowing lives on the generic companion
 * `EnrichedActivatedJobOf<J>` instead.
 */

// `extends` an interface — only legal if EnrichedActivatedJob is an interface (or
// object type). A generic alias with a required-less default still allows this,
// but a bare `extends EnrichedActivatedJob` documents the supported surface.
interface ConsumerExtends extends EnrichedActivatedJob {
  myField: string;
}

// Declaration merging — the canonical thing an interface supports and an alias
// does not. If EnrichedActivatedJob were a type alias this augmentation is a
// compile error.
declare module '../src/runtime/jobActions' {
  interface EnrichedActivatedJob {
    consumerAugmentedFlag?: boolean;
  }
}

// The generic projection stays available and defaults to the base shape.
type _AssertOfDefaultEqualsBase = EnrichedActivatedJobOf extends EnrichedActivatedJob
  ? true
  : false;
type _AssertBaseAssignableToOf = EnrichedActivatedJob extends EnrichedActivatedJobOf ? true : false;

const _ofDefault: _AssertOfDefaultEqualsBase = true;
const _baseAssignable: _AssertBaseAssignableToOf = true;

describe('EnrichedActivatedJob back-compat (interface, declaration-mergeable)', () => {
  it('compiles as an extendable, mergeable interface with a generic companion', () => {
    // Runtime shell: the real assertions above are compile-time. This keeps the
    // file a valid test module and touches the augmented member.
    const consumer = {} as ConsumerExtends;
    consumer.consumerAugmentedFlag = true;
    expect(_ofDefault).toBe(true);
    expect(_baseAssignable).toBe(true);
    expect(typeof consumer).toBe('object');
  });
});
