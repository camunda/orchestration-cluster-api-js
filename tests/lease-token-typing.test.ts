import { describe, expect, it } from 'vitest';
import createClient from '../src';
import type { JobLeaseToken } from '../src/gen/types.gen';

// Compile-time proof of the `x-present-when` derivation for activateJobs:
// leaseToken is guaranteed present on the `withLease: true` path, forbidden on
// the unleased path, and nullable on the dynamic path. These functions are
// never called at runtime (only `typeof`-referenced below); they exist so `tsc`
// checks the derived overload surface. If the hook regresses, the
// `@ts-expect-error` directives become unused and typecheck fails.
const camunda = createClient({
  config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
});

const baseInput = { type: 'test', timeout: 1000, maxJobsToActivate: 1 };

async function _leasedPath() {
  const res = await camunda.activateJobs({ ...baseInput, withLease: true });
  // leaseToken is non-null on the leased path — assignable to JobLeaseToken.
  const token: JobLeaseToken = res.jobs[0].leaseToken;
  return token;
}

async function _unleasedPath() {
  const res = await camunda.activateJobs({ ...baseInput });
  // @ts-expect-error leaseToken is absent (never) when activating without a lease.
  const token: JobLeaseToken = res.jobs[0].leaseToken;
  return token;
}

async function _unleasedExplicitFalsePath() {
  const res = await camunda.activateJobs({ ...baseInput, withLease: false });
  // @ts-expect-error leaseToken is absent when withLease is explicitly false.
  const token: JobLeaseToken = res.jobs[0].leaseToken;
  return token;
}

async function _dynamicPath(withLease: boolean) {
  const res = await camunda.activateJobs({ ...baseInput, withLease });
  // Dynamic (non-literal) request field falls back to the base nullable shape.
  const nullableToken: JobLeaseToken | null = res.jobs[0].leaseToken;
  // @ts-expect-error the dynamic path does not guarantee a non-null token.
  const token: JobLeaseToken = res.jobs[0].leaseToken;
  return { nullableToken, token };
}

describe('lease-token-typing', () => {
  it('exposes the derived overloads', () => {
    expect(typeof camunda.activateJobs).toBe('function');
    // Reference the compile-time fixtures so they are part of the program.
    expect(typeof _leasedPath).toBe('function');
    expect(typeof _unleasedPath).toBe('function');
    expect(typeof _unleasedExplicitFalsePath).toBe('function');
    expect(typeof _dynamicPath).toBe('function');
  });
});
