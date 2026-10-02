// Cancelable promise primitive shared by CamundaClient methods and the standalone
// per-operation functions (`@camunda8/orchestration-cluster-api/fn`). Lives in the
// runtime (not the generated class module) so a per-operation import does not pull
// in the client class.

export interface CancelablePromise<T> extends Promise<T> {
  cancel(): void;
}

/** @internal */
export function toCancelable<T>(
  factory: (signal: AbortSignal) => Promise<T>
): CancelablePromise<T> {
  const ac = new AbortController();
  let settled = false;
  let rejectRef: (e: any) => void = () => {};
  const p: any = new Promise<T>((resolve, reject) => {
    rejectRef = reject;
    factory(ac.signal)
      .then((v) => {
        settled = true;
        resolve(v);
      })
      .catch((e) => {
        // If already canceled and fetch produced an abort, translate to CancelSdkError once.
        if (
          ac.signal.aborted &&
          (e?.name === 'AbortError' || /abort|cancel/i.test(e?.message || ''))
        ) {
          const c = new Error('Cancelled') as any;
          c.name = 'CancelSdkError';
          return reject(c);
        }
        reject(e);
      });
  });
  p.cancel = () => {
    if (ac.signal.aborted) return; // idempotent
    ac.abort();
    // If underlying promise hasn't settled yet, proactively reject with CancelSdkError.
    if (!settled) {
      const c = new Error('Cancelled') as any;
      c.name = 'CancelSdkError';
      rejectRef(c);
    }
  };
  return p as CancelablePromise<T>;
}
