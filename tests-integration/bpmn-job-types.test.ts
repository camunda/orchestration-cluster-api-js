import { join } from 'node:path';

import { describe, it, expect } from 'vitest';

import {
  extractJobTypesFromBpmnFile,
  extractJobTypesFromBpmn,
  jobTypes,
} from '../test-support/bpmn';

const fixture = join(__dirname, 'fixtures', 'test-process.bpmn');

describe('BPMN job type extraction', () => {
  it('extracts job type from fixture file', () => {
    const types = extractJobTypesFromBpmnFile(fixture);
    expect(types).toEqual(['test-job']);
  });

  it('extracts multiple distinct job types without duplicates', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:zeebe="http://camunda.org/schema/zeebe/1.0">
      <bpmn:process id="p" isExecutable="true">
        <bpmn:serviceTask id="t1">
          <bpmn:extensionElements>
            <zeebe:taskDefinition type="alpha" />
          </bpmn:extensionElements>
        </bpmn:serviceTask>
        <bpmn:serviceTask id="t2">
          <bpmn:extensionElements>
            <zeebe:taskDefinition type='beta' />
          </bpmn:extensionElements>
        </bpmn:serviceTask>
        <bpmn:serviceTask id="t3">
          <bpmn:extensionElements>
            <zeebe:taskDefinition type="alpha" />
          </bpmn:extensionElements>
        </bpmn:serviceTask>
      </bpmn:process>
    </bpmn:definitions>`;
    expect(extractJobTypesFromBpmn(xml).sort()).toEqual(['alpha', 'beta']);
  });

  it('supports tagged template helper', () => {
    const types = jobTypes`<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:zeebe="http://camunda.org/schema/zeebe/1.0"><bpmn:process><bpmn:serviceTask><bpmn:extensionElements><zeebe:taskDefinition type="gamma" /></bpmn:extensionElements></bpmn:serviceTask></bpmn:process></bpmn:definitions>`;
    expect(types).toEqual(['gamma']);
  });

  it('ignores tasks without zeebe:taskDefinition type attribute', () => {
    const xml = `<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:zeebe="http://camunda.org/schema/zeebe/1.0"><bpmn:process><bpmn:serviceTask><bpmn:extensionElements><zeebe:taskDefinition /></bpmn:extensionElements></bpmn:serviceTask></bpmn:process></bpmn:definitions>`;
    expect(extractJobTypesFromBpmn(xml)).toEqual([]);
  });
});
