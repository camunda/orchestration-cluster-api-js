import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  DecisionDefinitionTypeEnum,
  GlobalTaskListenerEventTypeEnum,
  OwnerTypeEnum,
  PermissionTypeEnum,
  SortOrderEnum,
} from '../src';
import * as SDK from '../src';

describe('runtime enum objects', () => {
  it('PermissionTypeEnum exposes values at runtime', () => {
    expect(PermissionTypeEnum.ACCESS).toBe('ACCESS');
    expect(PermissionTypeEnum.CREATE_PROCESS_INSTANCE).toBe('CREATE_PROCESS_INSTANCE');
    const values = Object.values(PermissionTypeEnum);
    expect(values).toContain('ACCESS');
    expect(values).toContain('READ');
    expect(values.length).toBeGreaterThan(0);
  });

  it('OwnerTypeEnum exposes all members', () => {
    expect(OwnerTypeEnum.USER).toBe('USER');
    expect(OwnerTypeEnum.CLIENT).toBe('CLIENT');
    expect(Object.values(OwnerTypeEnum)).toEqual(
      expect.arrayContaining(['USER', 'CLIENT', 'ROLE', 'GROUP', 'MAPPING_RULE', 'UNSPECIFIED'])
    );
  });

  it('handles lowercase enum values (GlobalTaskListenerEventTypeEnum)', () => {
    expect(GlobalTaskListenerEventTypeEnum.all).toBe('all');
    expect(GlobalTaskListenerEventTypeEnum.creating).toBe('creating');
    expect(GlobalTaskListenerEventTypeEnum.canceling).toBe('canceling');
  });

  it('preserves deprecated members in the const object', () => {
    // Deprecated members should still be present at runtime
    expect(DecisionDefinitionTypeEnum.UNSPECIFIED).toBe('UNSPECIFIED');
    expect(DecisionDefinitionTypeEnum.DECISION_TABLE).toBe('DECISION_TABLE');
  });

  it('string literals remain assignable to the type', () => {
    // Backwards-compatibility: raw string literals still satisfy the enum type
    const order: SortOrderEnum = 'ASC';
    expect(order).toBe(SortOrderEnum.ASC);
  });

  it('supports validation of raw input via Object.values', () => {
    const valid = 'USER';
    const invalid = 'NOT_A_TYPE';
    const values = Object.values(OwnerTypeEnum) as string[];
    expect(values.includes(valid)).toBe(true);
    expect(values.includes(invalid)).toBe(false);
  });

  it('every *Enum type in types.gen.ts has a runtime const companion', () => {
    // Parse types.gen.ts to discover all enum names the hook should have transformed
    const typesPath = path.join(__dirname, '..', 'src', 'gen', 'types.gen.ts');
    const source = fs.readFileSync(typesPath, 'utf8');
    const enumNames: string[] = [];
    const pattern = /^export const (\w+Enum)\s*=/gm;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(source)) !== null) {
      enumNames.push(m[1]);
    }

    expect(enumNames.length).toBeGreaterThan(0);

    for (const name of enumNames) {
      const exported = (SDK as Record<string, unknown>)[name];
      expect(exported, `${name} should be exported from SDK`).toBeDefined();
      expect(typeof exported, `${name} should be an object`).toBe('object');

      const entries = Object.entries(exported as Record<string, string>);
      expect(entries.length, `${name} should have at least one member`).toBeGreaterThan(0);

      // Every entry should have key === value (the as-const identity pattern)
      for (const [key, value] of entries) {
        expect(value, `${name}.${key} should equal its key`).toBe(key);
      }
    }
  });
});
