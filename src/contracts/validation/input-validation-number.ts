import { Params } from './input-validation-params';

export interface NumberRequiredValidationConstrain {
  method: 'required';
  params: Omit<Params<any>, 'value'>;
}

export interface NumberMinValidationConstrain {
  method: 'min';
  params: Params<number>;
}

export interface NumberMaxValidationConstrain {
  method: 'max';
  params: Params<number>;
}

export interface NumberLessThanValidationConstrain {
  method: 'lessThan';
  params: Params<number>;
}

export interface NumberMoreThanValidationConstrain {
  method: 'moreThan';
  params: Params<number>;
}

export interface NumberPositiveValidationConstrain {
  method: 'positive';
  params: Omit<Params<any>, 'value'>;
}

export interface NumberNegativeValidationConstrain {
  method: 'negative';
  params: Omit<Params<any>, 'value'>;
}

export type NumberValidationConstrains =
  | NumberRequiredValidationConstrain
  | NumberMinValidationConstrain
  | NumberMaxValidationConstrain
  | NumberLessThanValidationConstrain
  | NumberMoreThanValidationConstrain
  | NumberPositiveValidationConstrain
  | NumberNegativeValidationConstrain;

export interface NumberValidationRules {
  type: 'number';
  constrains: NumberValidationConstrains[];
}
