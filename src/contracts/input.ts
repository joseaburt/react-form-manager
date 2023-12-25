import { CSSProperties } from 'react';

export interface BaseInput<T> {
  name: keyof T;
  label: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
  helperText?: string;
  style?: CSSProperties;
  htmlInputType?: HTMLInputElement['type'];
}
