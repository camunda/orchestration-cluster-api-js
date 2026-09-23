import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  NON_DETERMINISTIC_METADATA_KEYS,
  stripNonDeterministicMetadata,
} from '../scripts/strip-fixture-timestamps';

const repoRoot = join(__dirname, '..');
const readJson = (relativePath: string) =>
  JSON.parse(readFileSync(join(repoRoot, relativePath), 'utf8'));

describe('stripNonDeterministicMetadata', () => {
  it('removes every wall-clock metadata key', () => {
    const fixture = {
      metadata: Object.fromEntries([
        ['specSha256', 'abc'],
        ...NON_DETERMINISTIC_METADATA_KEYS.map((key) => [key, '2026-01-01T00:00:00.000Z']),
      ]),
      responses: [],
    };

    const { result, removed } = stripNonDeterministicMetadata(fixture);

    expect(Object.keys(result.metadata)).toEqual(['specSha256']);
    expect(removed).toEqual([...NON_DETERMINISTIC_METADATA_KEYS]);
  });

  it('leaves a fixture that is already deterministic untouched', () => {
    const fixture = { metadata: { specSha256: 'abc' }, responses: [] };

    const { result, removed } = stripNonDeterministicMetadata(fixture);

    expect(result).toEqual(fixture);
    expect(removed).toEqual([]);
  });

  it('tolerates a fixture with no metadata block', () => {
    const fixture = { responses: [] };

    expect(stripNonDeterministicMetadata(fixture).removed).toEqual([]);
  });
});

describe('committed response fixture', () => {
  // The defect class is any wall-clock field re-stamped on every regeneration,
  // not just the `generatedAt` that prompted this guard (issue #519).
  it('carries no wall-clock metadata', () => {
    const fixture = readJson('json-body-assertions/responses.json');

    for (const key of NON_DETERMINISTIC_METADATA_KEYS) {
      expect(fixture.metadata ?? {}).not.toHaveProperty(key);
    }
  });

  it('keeps the content hash that stands in for a timestamp', () => {
    const fixture = readJson('json-body-assertions/responses.json');

    expect(fixture.metadata.specSha256).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('regeneration scripts', () => {
  // Wiring the strip step into only one regenerate variant is how the
  // re-stamping would come back, so every `extract` call is checked.
  it('strip the fixture timestamps after every assert-json-body extract', () => {
    const { scripts } = readJson('package.json') as { scripts: Record<string, string> };

    const extractScripts = Object.entries(scripts).filter(([, command]) =>
      command.includes('assert-json-body extract')
    );

    expect(extractScripts.length).toBeGreaterThan(0);
    for (const [name, command] of extractScripts) {
      expect(command, `npm script "${name}" must strip the fixture timestamps`).toContain(
        'responses:strip-timestamps'
      );
    }
  });
});
