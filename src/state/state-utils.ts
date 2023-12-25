import { ErrorState } from '../contracts/validation/input-validation';

export default class StateReporterUtils {
  public static hasErrors<T>(errors: Partial<Record<keyof T, ErrorState>>): boolean {
    return Object.keys(errors).length === 0;
  }

  public static getFirstErrorMessage<T>(errors: Partial<Record<keyof T, ErrorState>>): string {
    const errorStates = Object.values(errors) as ErrorState[];
    if (!errorStates.length) return '';
    return errorStates[0].message;
  }

  public static getErrors<T>(errors: Partial<Record<keyof T, ErrorState>>): Partial<Record<keyof T, string>> {
    const response: Partial<Record<keyof T, string>> = {};
    for (const key of Object.keys(errors)) {
      response[key as keyof T] = errors[key as keyof T]!.message;
    }
    return response;
  }

  public static getChanges<T>(originalValue: T, modifiedValue: T): Partial<T> {
    const changes: Partial<T> = {};
    if (JSON.stringify(originalValue) === JSON.stringify(modifiedValue)) return changes;
    for (const key in modifiedValue) {
      if (modifiedValue?.hasOwnProperty(key) && originalValue[key as keyof T] !== modifiedValue[key as keyof T]) {
        changes[key as keyof T] = modifiedValue[key as keyof T];
      }
    }
    return changes;
  }
}
