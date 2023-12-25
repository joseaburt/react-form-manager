import { Params } from './input-validation-params';

export interface DateRequiredValidationConstrain {
  method: 'required';
  params: Omit<Params<any>, 'value'>;
}

export interface DateMinValidationConstrain {
  method: 'min';
  params: Params<string>;
}

export interface DateMaxValidationConstrain {
  method: 'max';
  params: Params<string>;
}

export type DateValidationConstrains = DateRequiredValidationConstrain | DateMinValidationConstrain | DateMaxValidationConstrain;

export interface DateValidationRules {
  type: 'date';
  constrains: DateValidationConstrains[];
}
