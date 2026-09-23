#!/usr/bin/env tsx
/**
 * Strips wall-clock metadata that `assert-json-body extract` stamps into
 * json-body-assertions/responses.json on every run.
 *
 * The extract tool is external, so the fixture is normalised here instead.
 * `specSha256` already carries the provenance the timestamp pretended to give,
 * and CONTRIBUTING.md's deterministic-build policy forbids the timestamp.
 */
import fs from 'node:fs';
import path from 'node:path';

export const NON_DETERMINISTIC_METADATA_KEYS = [
  'generatedAt',
  'generatedOn',
  'builtAt',
  'buildTime',
  'timestamp',
] as const;

type Fixture = { metadata?: Record<string, unknown>; [key: string]: unknown };

export function stripNonDeterministicMetadata<T extends Fixture>(
  fixture: T
): { result: T; removed: string[] } {
  const metadata = fixture.metadata;
  if (!metadata) return { result: fixture, removed: [] };

  const removed = NON_DETERMINISTIC_METADATA_KEYS.filter((key) => key in metadata);
  if (removed.length === 0) return { result: fixture, removed: [] };

  const cleaned = Object.fromEntries(
    Object.entries(metadata).filter(([key]) => !removed.includes(key as never))
  );
  return { result: { ...fixture, metadata: cleaned }, removed: [...removed] };
}

function main() {
  const fixturePath = path.join(process.cwd(), 'json-body-assertions', 'responses.json');
  if (!fs.existsSync(fixturePath)) {
    console.error(`[strip-fixture-timestamps] ${fixturePath} not found`);
    process.exit(1);
  }

  const raw = fs.readFileSync(fixturePath, 'utf8');
  const { result, removed } = stripNonDeterministicMetadata(JSON.parse(raw));
  if (removed.length === 0) {
    console.log('[strip-fixture-timestamps] no wall-clock metadata present');
    return;
  }

  // Matches how assert-json-body writes the file, so only the stripped keys move.
  fs.writeFileSync(fixturePath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`[strip-fixture-timestamps] removed ${removed.join(', ')}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  main();
}
