import { BaseInput } from './input';
import { ComponentType } from 'react';
import { ErrorState } from './validation/input-validation';

export type OnChangeArg<V> = {
  value: V;
  name: string;
};

export interface InputProps<T, V> extends BaseInput<T> {
  value: V;
  error: ErrorState;
  onChange(value: OnChangeArg<V>): void;
}

export type ViewComponentProps<T> = Pick<InputProps<T, any>, 'name' | 'label' | 'value' | 'error'>;
export type ViewComponent<T> = ComponentType<ViewComponentProps<T>>;
