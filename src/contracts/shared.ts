import { InputHTMLAttributes } from 'react';

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type WithType<K, T> = { type: K } & T;
export type LoggerFunc = (...args: any[]) => void;
export interface DivProps extends InputHTMLAttributes<HTMLDivElement> {}

export interface Meta {
  page: number;
  pageSize: number;
  total: number;
}

export interface BackendResponse<T> {
  data: T;
  meta: Meta | {};
}
