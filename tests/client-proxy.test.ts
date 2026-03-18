import { MessageChannel } from 'node:worker_threads';

import { describe, it, expect, vi } from 'vitest';

import { createClientProxy, installClientCallHandler } from '../src/runtime/clientProxy';

describe('ClientProxy', () => {
  it('forwards a method call and returns the result', async () => {
    const { port1, port2 } = new MessageChannel();

    // Mock client
    const mockClient = {
      publishMessage: vi.fn().mockResolvedValue({ messageKey: 'msg-123' }),
    };

    installClientCallHandler(port1, mockClient as any);
    const proxy = createClientProxy(port2);

    const result = await (proxy as any).publishMessage({
      name: 'test-msg',
      correlationKey: 'key-1',
    });

    expect(result).toEqual({ messageKey: 'msg-123' });
    expect(mockClient.publishMessage).toHaveBeenCalledWith({
      name: 'test-msg',
      correlationKey: 'key-1',
    });

    port1.close();
    port2.close();
  });

  it('forwards errors from the real client', async () => {
    const { port1, port2 } = new MessageChannel();

    const mockClient = {
      completeJob: vi.fn().mockRejectedValue(new Error('Job not found')),
    };

    installClientCallHandler(port1, mockClient as any);
    const proxy = createClientProxy(port2);

    await expect((proxy as any).completeJob({ jobKey: 'missing' })).rejects.toThrow(
      'Job not found'
    );

    port1.close();
    port2.close();
  });

  it('rejects if method does not exist on client', async () => {
    const { port1, port2 } = new MessageChannel();

    const mockClient = {};

    installClientCallHandler(port1, mockClient as any);
    const proxy = createClientProxy(port2);

    await expect((proxy as any).nonExistentMethod()).rejects.toThrow(
      "CamundaClient has no method 'nonExistentMethod'"
    );

    port1.close();
    port2.close();
  });

  it('handles multiple concurrent calls', async () => {
    const { port1, port2 } = new MessageChannel();

    let callOrder = 0;
    const mockClient = {
      methodA: vi.fn().mockImplementation(async () => {
        await new Promise((r) => setTimeout(r, 10));
        return { order: ++callOrder, method: 'A' };
      }),
      methodB: vi.fn().mockImplementation(async () => {
        return { order: ++callOrder, method: 'B' };
      }),
    };

    installClientCallHandler(port1, mockClient as any);
    const proxy = createClientProxy(port2);

    const [a, b] = await Promise.all([(proxy as any).methodA(), (proxy as any).methodB()]);

    // B should finish first (no delay), A second (10ms delay)
    expect(b.method).toBe('B');
    expect(a.method).toBe('A');
    expect(mockClient.methodA).toHaveBeenCalledTimes(1);
    expect(mockClient.methodB).toHaveBeenCalledTimes(1);

    port1.close();
    port2.close();
  });

  it('proxy is not treated as a thenable', () => {
    const { port1, port2 } = new MessageChannel();
    installClientCallHandler(port1, {} as any);
    const proxy = createClientProxy(port2);

    // .then should be undefined so the proxy doesn't auto-resolve in await contexts
    expect((proxy as any).then).toBeUndefined();

    port1.close();
    port2.close();
  });
});
