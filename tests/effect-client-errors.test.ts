import { Effect, Exit, Option } from 'effect';
import { describe, expect, it } from 'vitest';
import { createCamundaEffectClient } from '../src/effect';

// Guards the sync-throw defect class: the generated client validates some inputs
// *synchronously* (e.g. an eventual endpoint invoked without
// `consistencyManagement` throws before any network I/O). The Effect wrapper must
// route those into the tagged error channel, exactly like async rejections —
// never let them escape as an unhandled defect (die).
describe('createCamundaEffectClient routes synchronous client throws to the error channel', () => {
  it('missing consistencyManagement fails as a typed error, not a defect', async () => {
    const client = createCamundaEffectClient();

    // `getAgentDefinition` throws synchronously when the (required)
    // consistencyManagement argument is absent.
    const eff = (
      client as unknown as Record<string, (...a: unknown[]) => Effect.Effect<unknown, Error>>
    ).getAgentDefinition({ agentDefinitionId: 'x' }, undefined);

    const exit = await Effect.runPromiseExit(eff);

    expect(Exit.isFailure(exit)).toBe(true);
    if (Exit.isFailure(exit)) {
      // A typed failure lives in the error channel (findErrorOption is Some);
      // a defect would leave it None.
      const err = Exit.findErrorOption(exit);
      expect(Option.isSome(err)).toBe(true);
      if (Option.isSome(err)) {
        const message = String((err.value as { message?: unknown }).message ?? err.value);
        expect(message).toMatch(/consistencyManagement/i);
      }
    }
  });
});
