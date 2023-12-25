import { ViewMode } from './layout';
import { LoggerFunc } from './shared';
import FormEventBus from '../state/event-bus';
import { ErrorState, IValidator } from './validation/input-validation';

export type UnSubscribe = () => void;

export interface EventBus {
  off(event: string, handler: Function): void;
  listen(event: string, handler: Function): UnSubscribe;
  dispatch(event: string, payload?: unknown): void;
  once(event: string, handler: Function): void;
  getAllListenersFromEvent(event: string): Function[];
}

export interface FormStateReport<T> {
  // ⚠️ Read new docs for improve this. There I create a better solution
  state: T;
  isValid: boolean;
  hasChanged: boolean;
  changes: Partial<T>;
  debug: string;
  errors: Partial<Record<keyof T, string>>;
  touchedFields: Partial<Record<keyof T, boolean>>;
}

export interface InputState<T> {}

export type InputConfigurationsState<T, Configurations> = {
  [Property in keyof T]: Configurations;
};

export type InputsState<T> = {
  [Property in keyof T]: InputState<T>;
};

export interface IStateManager<T> {
  hideInputs(names: (keyof T)[]): void;
  showInputs(names: (keyof T)[]): void;
  resetState(): void;
  hardResetState(): void;
  resetErrors(): void;
  setInputValueInSilent(name: keyof T, value: any): void;

  getData(): T;
  setData(data: T): void;
  setDefaultData(data: T): void;
  validate(): void;
  isValid(): boolean;
  hideInput(name: keyof T): void;
  showInput(name: keyof T): void;
  enableInput(name: keyof T): void;
  disableInput(name: keyof T): void;
  setViewMode(mode: ViewMode): void;

  setLogger(logger?: LoggerFunc): void;
  setValidator(validator: IValidator): void;
  validateOnly(names: (keyof T)[]): void;
  validateSkip(names: (keyof T)[]): void;
  getStateReport(): FormStateReport<T>;
  setInputValue(name: keyof T, value: any): void;
  setInputViewMode(name: keyof T, mode: ViewMode): void;
  refreshInputOptions(name: keyof T, data: Record<string, string>): void;
  onFormStateChange(handler: (value: FormStateReport<T>) => void): UnSubscribe;
  onInputStateChange(name: keyof T, handler: (value: any) => void): UnSubscribe;
  onInputDisabledChange(name: keyof T, handler: (value: boolean) => void): UnSubscribe;
  onInputViewModeChange(name: keyof T, handler: (value: ViewMode) => void): UnSubscribe;
  onInputVisibilityChange(name: keyof T, handler: (value: boolean) => void): UnSubscribe;
  onInputValidationChange(name: keyof T, handler: (value: ErrorState) => void): UnSubscribe;
  onInputOptionRefresh(name: keyof T, handler: (value: Record<string, string>) => void): UnSubscribe;
}

export type StateManagerConstructorProps<T, Configurations> = {
  readonly state: T;
  readonly bus: FormEventBus;
  readonly logger?: LoggerFunc;
  readonly validator: IValidator;
  readonly inputConfigurations: InputConfigurationsState<T, Configurations>;
};
