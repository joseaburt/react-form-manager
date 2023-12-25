import { DateValidationRules } from './input-validation-date';
import { ArrayValidationRules } from './input-validation-array';
import { MixedValidationRules } from './input-validation-mixed';
import { NumberValidationRules } from './input-validation-number';
import { StringValidationRules } from './input-validation-string';

export type ValidationRulesTypes = MixedValidationRules | StringValidationRules | NumberValidationRules | DateValidationRules | ArrayValidationRules;

export interface ValidationRules {
  rules: ValidationRulesTypes;
}

export interface IValidationResult {
  getValue(): any;
  isValid(): boolean;
  getErrors(): string[];
}

export type ErrorState = { message: string; error: boolean };

export type ValidationArgs<T> = {
  value: any;
  name: keyof T;
  rules: ValidationRulesTypes;
};

export interface ValidationResult {
  message: string;
  isValid: () => boolean;
}

export interface IValidator {
  execute<T>({ name, value, rules }: ValidationArgs<T>): ValidationResult;
}
