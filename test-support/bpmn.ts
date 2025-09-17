/*
 * Utility to extract Zeebe job types from BPMN XML.
 * We avoid adding a heavy XML DOM dependency; a precise streaming regex approach
 * is sufficient for well-formed modeler output. If needs grow (namespaces, attributes
 * with entities), swap to fast-xml-parser.
 */

import { readFileSync } from 'node:fs';

// Match <zeebe:taskDefinition ... type="some-type" .../>
// Handles single or double quotes and arbitrary attribute ordering.
const TASK_DEFINITION_REGEX = /<zeebe:taskDefinition[^>]*?type\s*=\s*(?:"([^"]+)"|'([^']+)')[^>]*?>/g;

export function extractJobTypesFromBpmn(xml: string): string[] {
  const types = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = TASK_DEFINITION_REGEX.exec(xml)) !== null) {
    const value = match[1] ?? match[2];
    if (value) types.add(value.trim());
  }
  return [...types];
}

export function extractJobTypesFromBpmnFile(path: string): string[] {
  const xml = readFileSync(path, 'utf8');
  return extractJobTypesFromBpmn(xml);
}

// Small convenience for tests allowing inline tagged template usage.
export function jobTypes(strings: TemplateStringsArray, ...expr: any[]): string[] {
  const xml = strings.reduce((acc, s, i) => acc + s + (expr[i] ?? ''), '');
  return extractJobTypesFromBpmn(xml);
}
