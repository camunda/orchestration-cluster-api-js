import { describe, it, expect } from 'vitest';
import { z } from 'zod';

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
        actorType: 'user',
      };
      expect(response.actorId).toBe('user-123');
      expect(response.actorType).toBe('user');
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
        actorType: 'user',
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
        actorType: 'user',
      };
      expect(filter.actorType).toBe('user');
    });

    it('should accept both actor filters', () => {
      const filter: BatchOperationFilter = {
        actorId: 'user-123',
        actorType: 'user',
      };
      expect(filter.actorId).toBe('user-123');
      expect(filter.actorType).toBe('user');
    });

    it('should accept advanced actor filters', () => {
      const filter: BatchOperationFilter = {
        actorId: { $eq: 'user-123' },
        actorType: { $in: ['user', 'service'] },
      };
      expect(filter.actorId).toEqual({ $eq: 'user-123' });
      expect(filter.actorType).toEqual({ $in: ['user', 'service'] });
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
        actorType: 'user',
      };
      const result = zBatchOperationFilter.safeParse(filter);
      expect(result.success).toBe(true);
    });

    it('should validate filter with both actor fields', () => {
      const filter = {
        actorId: 'user-123',
        actorType: 'user',
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
      if (!result.success) {
        console.error('Validation errors:', result.error.errors);
      }
      expect(result.success).toBe(true);
    });

    it('should validate sort by actorType', () => {
      const sort = {
        field: 'actorType' as const,
      };
      const result = zBatchOperationSearchQuerySortRequest.safeParse(sort);
      if (!result.success) {
        console.error('Validation errors:', result.error.errors);
      }
      expect(result.success).toBe(true);
    });
  });

  describe('searchBatchOperations integration', () => {
    it('should compile with actor filter and sort', () => {
      const camunda = createClient({
        config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
      });

      // This test validates that the types compile correctly
      // We don't actually call the API because it requires consistencyManagement parameter
      // which is validated at runtime for eventually consistent endpoints
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _request = {
        filter: {
          actorId: 'user-123',
          actorType: 'user',
        },
        sort: [
          { field: 'actorId' as const, order: 'asc' as const },
          { field: 'actorType' as const, order: 'desc' as const },
        ],
      };

      // Just verify the function exists and types compile
      expect(typeof camunda.searchBatchOperations).toBe('function');
    });
  });
});
