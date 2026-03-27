import { describe, expect, it, vi } from 'vitest';
import type { CamundaClient } from '../src/gen/CamundaClient';
import type { JobResult, JobResultCorrections } from '../src/gen/types.gen';
import { enrichActivatedJob } from '../src/runtime/jobActions';

function createMockJob(overrides: Record<string, unknown> = {}) {
  return {
    jobKey: 'test-job-1',
    type: 'test-task',
    processInstanceKey: 'pi-1',
    processDefinitionKey: 'pd-1',
    bpmnProcessId: 'test-process',
    processDefinitionVersion: 1,
    elementId: 'task-1',
    elementInstanceKey: 'ei-1',
    retries: 3,
    deadline: new Date(Date.now() + 30000).toISOString(),
    variables: { orderId: '123' },
    customHeaders: {},
    worker: 'test-worker',
    tenantId: '<default>',
    ...overrides,
  } as any;
}

describe('job.complete() with corrections', () => {
  it('passes result to completeJob when corrections are provided', async () => {
    const completeJobMock = vi.fn().mockResolvedValue(undefined);
    const mockClient = { completeJob: completeJobMock } as unknown as CamundaClient;
    const mockLog = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() } as any;

    const raw = createMockJob();
    const job = enrichActivatedJob(raw, mockClient, mockLog);

    const corrections: JobResultCorrections = {
      assignee: 'corrected-user',
      priority: 80,
    };
    const result: JobResult = {
      type: 'userTask',
      corrections,
    };

    await job.complete({}, result);

    expect(completeJobMock).toHaveBeenCalledOnce();
    expect(completeJobMock).toHaveBeenCalledWith({
      variables: {},
      jobKey: 'test-job-1',
      result,
    });
  });

  it('passes result with denial to completeJob', async () => {
    const completeJobMock = vi.fn().mockResolvedValue(undefined);
    const mockClient = { completeJob: completeJobMock } as unknown as CamundaClient;
    const mockLog = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() } as any;

    const raw = createMockJob();
    const job = enrichActivatedJob(raw, mockClient, mockLog);

    const result: JobResult = {
      type: 'userTask',
      denied: true,
      deniedReason: 'Insufficient documentation',
    };

    await job.complete({}, result);

    expect(completeJobMock).toHaveBeenCalledWith({
      variables: {},
      jobKey: 'test-job-1',
      result,
    });
  });

  it('omits result when not provided (backward compatible)', async () => {
    const completeJobMock = vi.fn().mockResolvedValue(undefined);
    const mockClient = { completeJob: completeJobMock } as unknown as CamundaClient;
    const mockLog = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() } as any;

    const raw = createMockJob();
    const job = enrichActivatedJob(raw, mockClient, mockLog);

    await job.complete({ processed: true });

    expect(completeJobMock).toHaveBeenCalledWith({
      variables: { processed: true },
      jobKey: 'test-job-1',
      result: undefined,
    });
  });
});
