import { describe, it, expect, vi } from 'vitest';

import createClient from '../../src';

describe('searchBatchOperations', () => {
  it('should accept actor filter and sort, and receive actor fields in response', async () => {
    const fetchMock = vi.fn();
    const camunda = createClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
      fetch: fetchMock as any,
    });

    // Mock the API response with actor fields
    fetchMock.mockImplementationOnce(async (input: Request) => {
      expect(input.url).toContain('/batch-operations/search');

      // Verify the request body contains actor filter and sort
      const body = await input.json();
      expect(body.filter?.actorId).toBe('user-123');
      expect(body.filter?.actorType).toBe('USER');
      expect(body.sort).toContainEqual({ field: 'actorId', order: 'ASC' });
      expect(body.sort).toContainEqual({ field: 'actorType', order: 'DESC' });

      return new Response(
        JSON.stringify({
          items: [
            {
              batchOperationKey: '1001',
              state: 'COMPLETED',
              actorId: 'user-123',
              actorType: 'USER',
            },
            {
              batchOperationKey: '1002',
              state: 'ACTIVE',
              actorId: null,
              actorType: null,
            },
          ],
          total: 2,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    });

    // Call searchBatchOperations with actor filter and sort
    const result = await camunda.searchBatchOperations(
      {
        filter: {
          actorId: 'user-123',
          actorType: 'USER',
        },
        sort: [
          { field: 'actorId', order: 'ASC' },
          { field: 'actorType', order: 'DESC' },
        ],
      },
      { consistency: { waitUpToMs: 0 } }
    );

    // Verify the response includes actor fields
    expect(result.items).toHaveLength(2);
    expect(result.items?.[0].actorId).toBe('user-123');
    expect(result.items?.[0].actorType).toBe('USER');
    expect(result.items?.[1].actorId).toBeNull();
    expect(result.items?.[1].actorType).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
