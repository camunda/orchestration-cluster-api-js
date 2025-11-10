#!/usr/bin/env tsx
/**
 * Generates Markdown documentation for configuration derived from SCHEMA.
 * Output: docs/CONFIG_REFERENCE.md
 */
import { writeFileSync, mkdirSync } from 'node:fs';

import { SCHEMA } from '../src/runtime/configSchema';

function escapeCell(v: any): string {
  if (v === undefined || v === null) return '—';
  return String(v).replace(/\|/g, '\\|');
}

function table(): string {
  const header = '| Key | Type | Default | Requirement | Flags | Description |';
  const separator = '|-----|------|---------|-------------|-------|-------------|';
  const rows = Object.entries(SCHEMA)
    .map(([key, raw]) => {
      const entry: any = raw;
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
      const desc = entry.doc || entry.desc || '—';
      return `| \`${key}\` | ${escapeCell(type)} | ${escapeCell(def)} | ${escapeCell(req)} | ${escapeCell(flagStr)} | ${escapeCell(desc)} |`;
    })
    .join('\n');
  return `${header}\n${separator}\n${rows}`;
}

function main() {
  const md = ['# Configuration Reference', '', table(), ''].join('\n');
  mkdirSync('documentation', { recursive: true });
  writeFileSync('documentation/CONFIG_REFERENCE.md', md);
  console.log('Generated documentation/CONFIG_REFERENCE.md');
}

main();
