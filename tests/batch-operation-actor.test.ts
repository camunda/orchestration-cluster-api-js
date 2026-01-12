import { describe, it, expect, vi } from 'vitest';

import createClient from '../src';
import type {
  BatchOperationResponse,
  BatchOperationFilter,
  BatchOperationSearchQuerySortRequest,
} from '../src/gen/types.gen';
import {
  zBatchOperationResponse,
  zBatchOperationFilter,
  zBatchOperationSearchQuerySortRequest,
} from '../src/gen/zod.gen';

describe('batch operation actor support', () => {
  describe('BatchOperationResponse type', () => {
    it('should accept actorId and actorType fields when present', () => {
      const response: BatchOperationResponse = {
        batchOperationKey: '123',
        state: 'COMPLETED',
        actorId: 'user-123',
        actorType: 'USER',
      };
      expect(response.actorId).toBe('user-123');
      expect(response.actorType).toBe('USER');
    });

    it('should accept actorId and actorType as null', () => {
      const response: BatchOperationResponse = {
        batchOperationKey: '456',
        state: 'ACTIVE',
        actorId: null,
        actorType: null,
      };
      expect(response.actorId).toBeNull();
      expect(response.actorType).toBeNull();
    });

    it('should accept actorId and actorType as undefined (optional)', () => {
      const response: BatchOperationResponse = {
        batchOperationKey: '789',
        state: 'CREATED',
      };
      expect(response.actorId).toBeUndefined();
      expect(response.actorType).toBeUndefined();
    });
  });

  describe('BatchOperationResponse Zod schema', () => {
    it('should validate response with actor fields present', () => {
      const response = {
        batchOperationKey: '123',
        state: 'COMPLETED',
        actorId: 'user-123',
        actorType: 'USER',
      };
      const result = zBatchOperationResponse.safeParse(response);
      expect(result.success).toBe(true);
    });

    it('should validate response with actor fields as null', () => {
      const response = {
        batchOperationKey: '456',
        state: 'ACTIVE',
        actorId: null,
        actorType: null,
      };
      const result = zBatchOperationResponse.safeParse(response);
      expect(result.success).toBe(true);
    });

    it('should validate response without actor fields', () => {
      const response = {
        batchOperationKey: '789',
        state: 'CREATED',
      };
      const result = zBatchOperationResponse.safeParse(response);
      expect(result.success).toBe(true);
    });
  });

  describe('BatchOperationFilter type', () => {
    it('should accept actorId filter', () => {
      const filter: BatchOperationFilter = {
        actorId: 'user-123',
      };
      expect(filter.actorId).toBe('user-123');
    });

    it('should accept actorType filter', () => {
      const filter: BatchOperationFilter = {
        actorType: 'CLIENT',
      };
      expect(filter.actorType).toBe('CLIENT');
    });

    it('should accept both actor filters', () => {
      const filter: BatchOperationFilter = {
        actorId: 'user-123',
        actorType: 'USER',
      };
      expect(filter.actorId).toBe('user-123');
      expect(filter.actorType).toBe('USER');
    });

    it('should accept advanced actorId filter (actorType only supports enum)', () => {
      const filter: BatchOperationFilter = {
        actorId: { $eq: 'user-123' },
        actorType: 'USER',
      };
      expect(filter.actorId).toEqual({ $eq: 'user-123' });
      expect(filter.actorType).toBe('USER');
    });
  });

  describe('BatchOperationFilter Zod schema', () => {
    it('should validate filter with actorId', () => {
      const filter = {
        actorId: 'user-123',
      };
      const result = zBatchOperationFilter.safeParse(filter);
      expect(result.success).toBe(true);
    });

    it('should validate filter with actorType', () => {
      const filter = {
        actorType: 'CLIENT',
      };
      const result = zBatchOperationFilter.safeParse(filter);
      expect(result.success).toBe(true);
    });

    it('should validate filter with both actor fields', () => {
      const filter = {
        actorId: 'user-123',
        actorType: 'USER',
      };
      const result = zBatchOperationFilter.safeParse(filter);
      expect(result.success).toBe(true);
    });
  });

  describe('BatchOperationSearchQuerySortRequest type', () => {
    it('should accept actorId as sort field', () => {
      const sort: BatchOperationSearchQuerySortRequest = {
        field: 'actorId',
        order: 'asc',
      };
      expect(sort.field).toBe('actorId');
    });

    it('should accept actorType as sort field', () => {
      const sort: BatchOperationSearchQuerySortRequest = {
        field: 'actorType',
        order: 'desc',
      };
      expect(sort.field).toBe('actorType');
    });
  });

  describe('BatchOperationSearchQuerySortRequest Zod schema', () => {
    it('should validate sort by actorId', () => {
      const sort = {
        field: 'actorId' as const,
      };
      const result = zBatchOperationSearchQuerySortRequest.safeParse(sort);
      expect(result.success).toBe(true);
    });

    it('should validate sort by actorType', () => {
      const sort = {
        field: 'actorType' as const,
      };
      const result = zBatchOperationSearchQuerySortRequest.safeParse(sort);
      expect(result.success).toBe(true);
    });
  });

  describe('searchBatchOperations integration', () => {
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
        expect(body.sort).toContainEqual({ field: 'actorId', order: 'asc' });
        expect(body.sort).toContainEqual({ field: 'actorType', order: 'desc' });

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
            { field: 'actorId', order: 'asc' },
            { field: 'actorType', order: 'desc' },
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
});
