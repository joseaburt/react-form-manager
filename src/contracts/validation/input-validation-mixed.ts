import { Params } from './input-validation-params';

export interface MixedRequiredValidationConstrain {
  method: 'required';
  params: Omit<Params<RegExp>, 'value'>;
}

export interface MixedOneOfValidationConstrain {
  method: 'oneOf';
  params: Params<any[]>;
}

export interface MixedNotOneOfValidationConstrain {
  method: 'notOneOf';
  params: Params<any[]>;
}

export type MixedValidationConstrains = MixedRequiredValidationConstrain | MixedOneOfValidationConstrain | MixedNotOneOfValidationConstrain;

export interface MixedValidationRules {
  type: 'mixed';
  constrains: MixedValidationConstrains[];
}
