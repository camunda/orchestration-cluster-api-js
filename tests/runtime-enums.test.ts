import { describe, expect, it } from 'vitest';
import {
  PermissionTypeEnum,
  OwnerTypeEnum,
  GlobalTaskListenerEventTypeEnum,
  DecisionDefinitionTypeEnum,
  SortOrderEnum,
} from '../src';

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
});
