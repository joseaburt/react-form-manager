import { Params } from './input-validation-params';

export interface ArrayRequiredValidationConstrain {
  method: 'required';
  params: Omit<Params<any>, 'value'>;
}

export interface ArrayLengthValidationConstrain {
  method: 'length';
  params: Params<number>;
}

export interface ArrayMinValidationConstrain {
  method: 'min';
  params: Params<number>;
}

export interface ArrayMaxValidationConstrain {
  method: 'max';
  params: Params<number>;
}

export type ArrayValidationConstrains = ArrayRequiredValidationConstrain | ArrayLengthValidationConstrain | ArrayMinValidationConstrain | ArrayMaxValidationConstrain;

export interface ArrayValidationRules {
  type: 'array';
  constrains: ArrayValidationConstrains[];
}
