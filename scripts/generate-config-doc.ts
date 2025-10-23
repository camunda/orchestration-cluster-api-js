#!/usr/bin/env tsx
/**
 * Generates Markdown documentation for configuration derived from SCHEMA.
 * Output: docs/CONFIG_REFERENCE.md
 */
import { writeFileSync, mkdirSync } from 'node:fs';

import { SCHEMA } from '../src/runtime/configSchema';

function table(): string {
  const rows = Object.entries(SCHEMA)
    .map(([key, raw]) => {
      const entry: any = raw; // permissive for optional props
      const type =
        entry.type === 'enum' ? 'enum(' + (entry.choices || []).join(' | ') + ')' : entry.type;
      const def = entry.default !== undefined ? `\`${entry.default}\`` : '—';
      const req = entry.requiredWhen
        ? `When ${entry.requiredWhen.key}=${entry.requiredWhen.equals}`
        : entry.default === undefined
          ? 'No default'
          : 'Optional';
      const flags: string[] = [];
      if (entry.secret) flags.push('secret');
      const flagStr = flags.join(',');
      return `| \`${key}\` | ${type} | ${def} | ${req} | ${flagStr} | ${entry.doc} |`;
    })
    .join('\n');
  return `| Key | Type | Default | Requirement | Flags | Description |\n|-----|------|---------|-------------|-------|-------------|\n${rows}`;
}

function main() {
  const nowTs = process.env.CAMUNDA_SDK_DETERMINISTIC_BUILD
    ? '1970-01-01T00:00:00.000Z'
    : new Date().toISOString();
  const md = ['# Configuration Reference', '', 'Generated: ' + nowTs, '', table(), ''].join('\n');
  mkdirSync('docs', { recursive: true });
  writeFileSync('docs/CONFIG_REFERENCE.md', md);
  console.log('Generated docs/CONFIG_REFERENCE.md');
}

main();
