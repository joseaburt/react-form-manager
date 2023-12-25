import { Params } from './input-validation-params';

export interface StringRequiredValidationConstrain {
  method: 'required';
  params: Omit<Params<any>, 'value'>;
}

export interface StringLengthValidationConstrain {
  method: 'length';
  params: Params<number>;
}

export interface StringMinValidationConstrain {
  method: 'min';
  params: Params<number>;
}

export interface StringMaxValidationConstrain {
  method: 'max';
  params: Params<number>;
}

export interface StringMatchesValidationConstrain {
  method: 'matches';
  params: Params<RegExp>;
}

export interface StringEmailValidationConstrain {
  method: 'email';
  params: Omit<Params<any>, 'value'>;
}

export interface StringLowerCaseValidationConstrain {
  method: 'lowercase';
  params: Omit<Params<any>, 'value'>;
}

export interface StringUpperCaseValidationConstrain {
  method: 'uppercase';
  params: Omit<Params<any>, 'value'>;
}

export interface StringNullableValidationConstrain {
  method: 'nullable';
  params: Omit<Params<any>, 'value'>;
}

export type StringValidationConstrains =
  | StringRequiredValidationConstrain
  | StringLengthValidationConstrain
  | StringMinValidationConstrain
  | StringMaxValidationConstrain
  | StringMatchesValidationConstrain
  | StringEmailValidationConstrain
  | StringLowerCaseValidationConstrain
  | StringUpperCaseValidationConstrain
  | StringNullableValidationConstrain;

export interface StringValidationRules {
  type: 'string';
  constrains: StringValidationConstrains[];
}
