import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import ts from 'typescript';
import { afterEach, describe, expect, it } from 'vitest';

// TypeDoc documents only exported declarations. When the class carrying the client's
// operation methods stopped being exported, the whole method reference vanished from
// the published docs without any build failure.

const repoRoot = join(__dirname, '..');
const clientPath = join(repoRoot, 'src/gen/CamundaClient.ts');
const clientSource = readFileSync(clientPath, 'utf8');
const operationIds = [
  ...new Set([...clientSource.matchAll(/@operationId\s+(\w+)/g)].map((m) => m[1])),
];

describe('client method reference', () => {
  it('declares every operation on a class that the package entry exports', () => {
    const sf = ts.createSourceFile(clientPath, clientSource, ts.ScriptTarget.Latest, true);
    const exportedClasses = sf.statements.filter(
      (s): s is ts.ClassDeclaration =>
        ts.isClassDeclaration(s) &&
        !!s.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    );
    const exportedMethods = new Set(
      exportedClasses.flatMap((c) =>
        c.members.filter(ts.isMethodDeclaration).map((m) => m.name.getText(sf).toLowerCase())
      )
    );

    expect(operationIds.length).toBeGreaterThan(0);
    const undocumented = operationIds.filter((op) => !exportedMethods.has(op.toLowerCase()));
    expect(undocumented).toEqual([]);
    expect(readFileSync(join(repoRoot, 'src/index.ts'), 'utf8')).toContain(
      "export * from './gen/CamundaClient'"
    );
  });
});

describe('check-client-method-docs', () => {
  const script = join(repoRoot, 'scripts/check-client-method-docs.mjs');
  let docsDir: string;

  function run(headings: string[] | null) {
    docsDir = mkdtempSync(join(tmpdir(), 'docs-md-'));
    const classesDir = join(docsDir, 'index', 'classes');
    mkdirSync(classesDir, { recursive: true });
    if (headings) writeFileSync(join(classesDir, 'Client.md'), headings.join('\n\n'));
    return spawnSync(process.execPath, [script, docsDir], { encoding: 'utf8' });
  }

  afterEach(() => rmSync(docsDir, { recursive: true, force: true }));

  it('passes when every operation has a method heading, incl. deprecated and XML→Xml', () => {
    const headings = operationIds.map((op, i) =>
      i === 0 ? `### ~~${op.replace(/XML/g, 'Xml')}()~~` : `### ${op.replace(/XML/g, 'Xml')}()`
    );
    const result = run(headings);
    expect(result.status, result.stderr).toBe(0);
  });

  it('fails naming the operation when one method is undocumented', () => {
    const [dropped, ...rest] = operationIds;
    const result = run(rest.map((op) => `### ${op}()`));
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain(dropped);
  });

  it('fails when no class page documents the client at all', () => {
    const result = run(null);
    expect(result.status).not.toBe(0);
  });
});
