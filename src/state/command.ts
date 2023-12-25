import FormEventBus from './event-bus';
import { ViewMode } from '../contracts/layout';
import { LoggerFunc } from '../contracts/shared';
import { FormStateReport, UnSubscribe } from '../contracts/state';
import { ErrorState } from '../contracts/validation/input-validation';

export class Logger {
  private logger: LoggerFunc | undefined;

  constructor(logger?: LoggerFunc) {
    this.logger = logger;
  }

  public setLogger(logger?: LoggerFunc): void {
    this.logger = logger;
  }

  protected log(...args: any[]) {
    if (typeof this.logger === 'function') this.logger(...args);
  }

  protected logCommand(event: string, value: any) {
    this.log({
      event,
      type: 'Command',
      payload: value,
      time: new Date().toISOString(),
    });
  }
}

export default class FormEventDispatcher<T> extends Logger {
  protected bus: FormEventBus;

  constructor(bus: FormEventBus, logger?: LoggerFunc) {
    super(logger);
    this.bus = bus;
  }

  protected notifyInputValueChange(name: string, value: any) {
    this.logCommand(`${name}:INPUT_VALUE_CHANGED`, value);
    this.bus.dispatch(`${name}:INPUT_VALUE_CHANGED`, value);
  }

  protected createOnInputValueChange(name: keyof T, handler: (value: any) => void): UnSubscribe {
    return this.bus.listen(`${name as string}:INPUT_VALUE_CHANGED`, handler);
  }

  protected notifyInputVisibilityChange(name: string, hidden: boolean) {
    this.logCommand(`${name}:INPUT_HIDDEN_CHANGED`, hidden);
    this.bus.dispatch(`${name}:INPUT_HIDDEN_CHANGED`, hidden);
  }

  protected createOnInputVisibilityChange(name: keyof T, handler: (value: boolean) => void): UnSubscribe {
    return this.bus.listen(`${name as string}:INPUT_HIDDEN_CHANGED`, handler);
  }

  protected notifyInputViewModeChange(name: string, mode: ViewMode) {
    this.logCommand(`${name}:INPUT_VIEW_MODE_CHANGED`, mode);
    this.bus.dispatch(`${name}:INPUT_VIEW_MODE_CHANGED`, mode);
  }

  protected createOnInputViewModeChange(name: keyof T, handler: (value: ViewMode) => void): UnSubscribe {
    return this.bus.listen(`${name as string}:INPUT_VIEW_MODE_CHANGED`, handler);
  }

  protected notifyInputDisabledChange(name: string, disabled: boolean) {
    this.logCommand(`${name}:INPUT_DISABLED_CHANGED`, disabled);
    this.bus.dispatch(`${name}:INPUT_DISABLED_CHANGED`, disabled);
  }

  protected createOnInputDisabledChange(name: keyof T, handler: (value: boolean) => void): UnSubscribe {
    return this.bus.listen(`${name as string}:INPUT_DISABLED_CHANGED`, handler);
  }

  protected notifyInputValidityChange(name: string, value: ErrorState) {
    this.logCommand(`${name}:INPUT_VALIDATION_CHANGED`, value);
    this.bus.dispatch(`${name}:INPUT_VALIDATION_CHANGED`, value);
  }

  protected createOnInputValidityChange(name: keyof T, handler: (value: ErrorState) => void): UnSubscribe {
    return this.bus.listen(`${name as string}:INPUT_VALIDATION_CHANGED`, handler);
  }

  protected notifyFormStateChange(value: FormStateReport<T>): void {
    this.logCommand(`FORM_STATE_CHANGED`, value);
    this.bus.dispatch('FORM_STATE_CHANGED', value);
  }

  protected createOnFormStateChange(handler: (value: FormStateReport<T>) => void): UnSubscribe {
    return this.bus.listen('FORM_STATE_CHANGED', handler);
  }

  protected notifyRefreshInputOptions(name: keyof T, data: Record<string, string>): void {
    this.logCommand(`${name as string}:INPUT_REFRESH_OPTIONS`, data);
    this.bus.dispatch(`${name as string}:INPUT_REFRESH_OPTIONS`, data);
  }

  protected createOnInputOptionRefresh(name: keyof T, handler: (value: Record<string, string>) => void): UnSubscribe {
    return this.bus.listen(`${name as string}:INPUT_REFRESH_OPTIONS`, handler);
  }
}
