import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { createCamundaClient } from '../src';

describe('searchVariablesAsDto', () => {
  it('finds process instance variables bound to a Dto', { timeout: 20_000 }, async () => {
    const camunda = createCamundaClient();

    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-process.bpmn',
    ]);

    // The process waits at a service task, so its variables persist on the
    // running instance for the duration of the search.
    const orderId = `order-${Date.now()}`;
    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
      variables: {
        orderId,
        amount: 42,
        // An extra variable that is not declared on the Dto and must be ignored.
        internalSecret: 'do-not-leak',
      },
    });

    try {
      // The Zod schema is the Dto: its keys are the exact variable names to
      // fetch, and its shape drives validation.
      const OrderVariables = z.object({
        orderId: z.string(),
        amount: z.number().optional(),
      });

      const map = await camunda.searchVariablesAsDto(OrderVariables, {
        processInstanceKey: process.processInstanceKey,
        // Variables are eventually consistent on a freshly-created instance, so
        // poll until the declared variables are visible.
        consistency: { waitUpToMs: 10_000 },
      });

      // Lenient access.
      expect(map.has('orderId')).toBe(true);
      expect(map.has('amount')).toBe(true);
      expect(map.get('orderId')).toBe(orderId);
      expect(map.get('amount')).toBe(42);

      // Only the declared variables are queried — the extra one is never fetched.
      expect(map.has('internalSecret')).toBe(false);
      expect(Object.keys(map.raw).sort()).toEqual(['amount', 'orderId']);

      // Strict access: returns a fully-typed, validated Dto.
      const order = map.validate();
      expect(order).toEqual({ orderId, amount: 42 });
    } finally {
      await camunda.cancelProcessInstance({
        processInstanceKey: process.processInstanceKey,
      });
    }
  });

  it('throws on validate when a required Dto field is missing at runtime', {
    timeout: 20_000,
  }, async () => {
    const camunda = createCamundaClient();

    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-process.bpmn',
    ]);

    const orderId = `order-${Date.now()}`;
    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
      variables: { orderId },
    });

    try {
      // The Dto declares a required `customerId` variable that the instance
      // never set, so it is absent at runtime.
      const OrderVariables = z.object({
        orderId: z.string(),
        customerId: z.string(),
      });

      const map = await camunda.searchVariablesAsDto(OrderVariables, {
        processInstanceKey: process.processInstanceKey,
        consistency: { waitUpToMs: 10_000 },
      });

      // The declared-but-absent variable is simply missing — lenient access
      // never throws.
      expect(map.has('orderId')).toBe(true);
      expect(map.has('customerId')).toBe(false);

      // Strict validation fails because a required variable is missing.
      expect(() => map.validate()).toThrowError(z.ZodError);
    } finally {
      await camunda.cancelProcessInstance({
        processInstanceKey: process.processInstanceKey,
      });
    }
  });
});
