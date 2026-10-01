// Browser implementation of the `#platform` seam. See ./types.ts.
// Node-only features (file token cache, mTLS, support log file, threaded
// workers, deployResourcesFromFiles) see `undefined` and degrade or throw.
import type { NodeBuiltins } from './types';

export const node: NodeBuiltins | undefined = undefined;
