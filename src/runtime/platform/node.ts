// Node implementation of the `#platform` seam. See ./types.ts.
import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as fsPromises from 'node:fs/promises';
import * as https from 'node:https';
import * as os from 'node:os';
import * as path from 'node:path';
import * as url from 'node:url';
import type { NodeBuiltins } from './types';

export const node: NodeBuiltins | undefined = {
  fs,
  fsPromises,
  path,
  os,
  https,
  url,
  crypto,
  loadWorkerThreads: () => import('node:worker_threads'),
};
