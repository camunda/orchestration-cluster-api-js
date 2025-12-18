import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import SwaggerParser from '@apidevtools/swagger-parser';

export type OpenApiDocument = Record<string, any>;

export function listFilesRecursive(dir: string): string[] {
  const out: string[] = [];
  const stack: string[] = [dir];
  while (stack.length) {
    const cur = stack.pop()!;
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile()) out.push(p);
    }
  }
  out.sort();
  return out;
}

/**
 * Deterministic hash of a directory tree.
 * Includes relative file path + file content in hash to catch renames and edits.
 */
export function hashDirectoryTree(rootDir: string): string {
  const files = listFilesRecursive(rootDir);
  const h = crypto.createHash('sha256');
  for (const abs of files) {
    const rel = path.relative(rootDir, abs).replace(/\\/g, '/');
    h.update(rel);
    h.update('\0');
    h.update(fs.readFileSync(abs));
    h.update('\0');
  }
  return 'sha256:' + h.digest('hex');
}

/**
 * Loads and dereferences a (potentially multi-file) OpenAPI spec.
 * This resolves local file refs so downstream scripts can inspect schemas/paths.
 */
export async function loadOpenApiDereferenced(specEntryPath: string): Promise<OpenApiDocument> {
  // swagger-parser accepts file paths and will resolve relative refs on disk.
  // We allow file and http refs, but in practice this repo expects file refs.
  // NOTE: Do not override `resolve` defaults here.
  // The upstream spec is YAML and split across multiple YAML files; SwaggerParser's
  // default resolvers/parsers correctly handle this, while a boolean `resolve.file/http`
  // override can break YAML loading in practice.
  return (await SwaggerParser.dereference(specEntryPath, {
    dereference: { circular: 'ignore' },
  })) as any;
}
