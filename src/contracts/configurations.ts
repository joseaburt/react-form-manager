import { BaseInput } from './input';
import { ViewComponent } from './props';
import { Breakpoints, ViewMode } from './layout';
import { ValidationRulesTypes } from './validation/input-validation';

export interface InputConfiguration<T> extends BaseInput<T> {
  defaultHidden?: boolean;
  defaultViewMode?: ViewMode;
  defaultDisabled?: boolean;
  breakpoints?: Breakpoints;
  validationRules?: ValidationRulesTypes;
  customViewModeFactory?: ViewComponent<T>;
}
