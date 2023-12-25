import FormEventDispatcher from './command';
import StateReporterUtils from './state-utils';
import { ViewMode } from '../contracts/layout';
import {
  ErrorState,
  IValidator,
  ValidationRulesTypes,
} from '../contracts/validation/input-validation';
import {
  FormStateReport,
  IStateManager,
  InputConfigurationsState,
  StateManagerConstructorProps,
  UnSubscribe,
} from '../contracts/state';

export default class StateManager<T>
  extends FormEventDispatcher<T>
  implements IStateManager<T>
{
  protected data: T;
  protected defaultState: T;
  protected validator: IValidator;
  protected stateReport: FormStateReport<T>;
  protected inputConfigurations: InputConfigurationsState<T, any>;

  // Inputs Observable Fields
  protected touchedInputs: Partial<Record<keyof T, boolean>> = {};
  protected inputsValue: Record<keyof T, any> = {} as Record<keyof T, any>;
  protected inputsError: Partial<Record<keyof T, ErrorState>> = {};
  protected hiddenInputs: Partial<Record<keyof T, boolean>> = {};
  protected disabledInputs: Partial<Record<keyof T, boolean>> = {};
  protected inputsViewMode: Partial<Record<keyof T, ViewMode>> = {};
  protected inputValidationRules: Record<keyof T, ValidationRulesTypes> =
    {} as Record<keyof T, ValidationRulesTypes>;

  public hardResetState(): void {
    this.inputsError = {};
    this.hiddenInputs = {};
    this.disabledInputs = {};
    this.inputsViewMode = {};
    this.touchedInputs = {};
    this.data = { ...this.defaultState };

    for (const key of Object.keys(this.inputConfigurations)) {
      const name = key as keyof T;
      const configuration = this.inputConfigurations[name];

      this.inputsValue[name] = this.data[name];
      this.notifyInputValueChange(key, this.inputsValue[name]);

      this.hiddenInputs[name] = !!configuration.defaultHidden;
      this.notifyInputVisibilityChange(key, !!this.hiddenInputs[name]);

      this.disabledInputs[name] = !!configuration.disabled;
      this.notifyInputDisabledChange(key, !!this.disabledInputs[name]);

      this.inputsViewMode[name] = configuration.defaultViewMode ?? 'edit';
      this.notifyInputViewModeChange(key, this.inputsViewMode[name] ?? 'edit');

      if (configuration.validationRules)
        this.inputValidationRules[name] = configuration.validationRules;
    }

    this.stateReport = this.createReport();
    this.notifyFormStateChange(this.stateReport);
  }

  constructor(props: StateManagerConstructorProps<T, any>) {
    super(props.bus, props.logger);
    this.data = { ...props.state };
    this.validator = props.validator;
    this.defaultState = { ...props.state };
    this.inputConfigurations = { ...props.inputConfigurations };

    for (const key of Object.keys(this.inputConfigurations)) {
      const name = key as keyof T;
      const configuration = this.inputConfigurations[name];

      this.inputsValue[name] = this.data[name];
      this.notifyInputValueChange(key, this.inputsValue[name]);

      this.hiddenInputs[name] = !!configuration.defaultHidden;
      this.notifyInputVisibilityChange(key, !!this.hiddenInputs[name]);

      this.disabledInputs[name] = !!configuration.disabled;
      this.notifyInputDisabledChange(key, !!this.disabledInputs[name]);

      this.inputsViewMode[name] = configuration.defaultViewMode ?? 'edit';
      this.notifyInputViewModeChange(key, this.inputsViewMode[name] ?? 'edit');

      if (configuration.validationRules) {
        this.inputValidationRules[name] = configuration.validationRules;
        // this.validateInput(name, this.inputsValue[name], this.inputValidationRules[name]);
      }
    }

    this.stateReport = this.createReport();
    this.notifyFormStateChange(this.stateReport);
  }

  public getStateReport(): FormStateReport<T> {
    return this.stateReport;
  }

  public setValidator(validator: IValidator): void {
    this.validator = validator;
  }

  protected createReport(): FormStateReport<T> {
    let isValid = true;
    let debug = 'Everything is ok 👌🏽👏🏽';
    const changes = StateReporterUtils.getChanges<T>(
      this.defaultState,
      this.data
    );

    for (const key of Object.keys(this.touchedInputs)) {
      const name = key as keyof T;
      const rules = this.inputConfigurations[name]?.validationRules;
      if (!rules) continue;

      const isTouched = this.touchedInputs[name];
      const isRequired = rules.constrains
        ? !!rules.constrains.find((item: any) => item.method === 'required')
        : false;

      if (isRequired && !isTouched) {
        isValid = false;
        debug = `Input ${key} need to be filled. Not touched at the moment.`;
        break;
      }
    }

    if (isValid) {
      isValid = StateReporterUtils.hasErrors<T>(this.inputsError);
      if (!isValid)
        debug = StateReporterUtils.getFirstErrorMessage<T>(this.inputsError);
    }

    return {
      debug,
      isValid,
      changes,
      state: this.data,
      touchedFields: { ...this.touchedInputs },
      hasChanged: !!Object.keys(changes).length,
      errors: StateReporterUtils.getErrors<T>(this.inputsError),
    };
  }

  protected validateInput(
    name: keyof T,
    value: any,
    rules: ValidationRulesTypes
  ): void {
    const result = this.validator.execute({ name, value, rules });
    const error: ErrorState = {
      error: !result.isValid(),
      message: result.message,
    };
    if (!error.error) delete this.inputsError[name];
    else this.inputsError[name] = error;
    this.notifyInputValidityChange(name as string, error);
  }

  // Setters

  private setInputValueHelper(name: keyof T, value: any): void {
    this.data[name] = value;
    this.touchedInputs[name] = true;
    this.inputsValue[name] = value;
    this.notifyInputValueChange(name as string, this.inputsValue[name]);

    const rules = this.inputConfigurations[name]?.validationRules;
    if (rules) this.validateInput(name, value, rules);
  }

  public setInputValue(name: keyof T, value: any): void {
    this.setInputValueHelper(name, value);
    this.stateReport = this.createReport();
    this.notifyFormStateChange(this.stateReport);
  }

  public setInputValueInSilent(name: keyof T, value: any): void {
    this.data[name] = value;
    this.touchedInputs[name] = true;
    this.inputsValue[name] = value;
    this.notifyInputValueChange(name as string, this.inputsValue[name]);
  }

  public onInputStateChange(
    name: keyof T,
    handler: (value: any) => void
  ): UnSubscribe {
    handler(this.inputsValue[name]);
    return this.createOnInputValueChange(name, handler);
  }

  public disableInput(name: keyof T): void {
    this.disabledInputs[name] = true;
    this.notifyInputDisabledChange(name as string, !!this.disabledInputs[name]);
  }

  public enableInput(name: keyof T): void {
    this.disabledInputs[name] = false;
    this.notifyInputDisabledChange(name as string, !!this.disabledInputs[name]);
  }

  public onInputDisabledChange(
    name: keyof T,
    handler: (value: boolean) => void
  ): UnSubscribe {
    handler(!!this.disabledInputs[name]);
    return this.createOnInputDisabledChange(name, handler);
  }

  public showInput(name: keyof T): void {
    this.hiddenInputs[name] = false;
    this.notifyInputVisibilityChange(name as string, !!this.hiddenInputs[name]);
  }

  /**
   * Promise to remove a controller element from the DOM.
   *
   * **Listener**: `onInputVisibilityChange`
   */
  public hideInput(name: keyof T): void {
    this.hiddenInputs[name] = true;
    this.notifyInputVisibilityChange(name as string, !!this.hiddenInputs[name]);
  }

  public hideInputs(names: (keyof T)[]): void {
    for (const name of names) this.hideInput(name);
  }

  public showInputs(names: (keyof T)[]): void {
    for (const name of names) this.showInput(name);
  }

  /**
   * Listen for input `hidden` state. The `handler` will be call after `showInput`, `hideInput`
   */
  public onInputVisibilityChange(
    name: keyof T,
    handler: (value: boolean) => void
  ): UnSubscribe {
    handler(!!this.hiddenInputs[name]);
    return this.createOnInputVisibilityChange(name, handler);
  }

  public setInputViewMode(name: keyof T, mode: ViewMode): void {
    if (!['view', 'edit'].includes(mode as string)) return;
    this.inputsViewMode[name] = mode;
    this.notifyInputViewModeChange(
      name as string,
      this.inputsViewMode[name] ?? 'edit'
    );
  }

  public setViewMode(mode: ViewMode): void {
    for (const key of Object.keys(this.inputConfigurations)) {
      this.setInputViewMode(key as keyof T, mode);
    }
  }

  public onInputViewModeChange(
    name: keyof T,
    handler: (value: ViewMode) => void
  ): UnSubscribe {
    handler(this.inputsViewMode[name] ?? 'edit');
    return this.createOnInputViewModeChange(name, handler);
  }

  public setData(data: T): void {
    this.data = { ...data };

    for (const key of Object.keys(this.inputConfigurations)) {
      this.setInputValueHelper(key as keyof T, this.data[key as keyof T]);
    }

    this.stateReport = this.createReport();
    this.notifyFormStateChange(this.stateReport);
  }

  public setDefaultData(data: T): void {
    this.defaultState = { ...data };
  }

  public getData(): T {
    return { ...this.data };
  }

  public onFormStateChange(
    handler: (value: FormStateReport<T>) => void
  ): UnSubscribe {
    handler(this.stateReport);
    return this.createOnFormStateChange(handler);
  }

  public onInputValidationChange(
    name: keyof T,
    handler: (value: ErrorState) => void
  ): UnSubscribe {
    const value = this.inputsError[name];
    handler(value ?? { error: false, message: '' });
    return this.createOnInputValidityChange(name, handler);
  }

  public validate(): void {
    for (const key of Object.keys(this.inputConfigurations)) {
      const name = key as keyof T;
      const configuration = this.inputConfigurations[name];
      if (configuration.validationRules) {
        this.validateInput(
          name,
          this.inputsValue[name],
          this.inputValidationRules[name]
        );
      }
    }
  }

  public validateOnly(names: (keyof T)[]): void {
    for (const name of names) {
      const configuration = this.inputConfigurations[name];
      if (configuration.validationRules) {
        this.validateInput(
          name,
          this.inputsValue[name],
          this.inputValidationRules[name]
        );
      }
    }
    this.stateReport = this.createReport();
    this.notifyFormStateChange(this.stateReport);
  }

  public validateSkip(names: (keyof T)[]): void {
    for (const key of Object.keys(this.inputConfigurations)) {
      const name = key as keyof T;
      if (names.includes(name)) continue;
      const configuration = this.inputConfigurations[name];
      if (configuration.validationRules) {
        this.validateInput(
          name,
          this.inputsValue[name],
          this.inputValidationRules[name]
        );
      }
    }
    this.stateReport = this.createReport();
    this.notifyFormStateChange(this.stateReport);
  }

  public resetErrors(): void {
    this.inputsError = {};
    for (const key of Object.keys(this.inputConfigurations)) {
      const name = key as keyof T;
      this.inputsValue[name] = this.data[name];
      this.notifyInputValidityChange(name as string, {
        error: false,
        message: '',
      });
    }

    this.stateReport = this.createReport();
    this.notifyFormStateChange(this.stateReport);
  }

  public resetState(): void {
    this.inputsError = {};
    this.touchedInputs = {};
    this.data = { ...this.defaultState };

    for (const key of Object.keys(this.inputConfigurations)) {
      const name = key as keyof T;
      this.inputsValue[name] = this.data[name];
      this.notifyInputValueChange(key, this.inputsValue[name]);
      this.notifyInputValidityChange(name as string, {
        error: false,
        message: '',
      });
    }

    this.stateReport = this.createReport();
    this.notifyFormStateChange(this.stateReport);
  }

  public isValid(): boolean {
    return StateReporterUtils.hasErrors<T>(this.inputsError);
  }

  public refreshInputOptions(
    name: keyof T,
    data: Record<string, string>
  ): void {
    this.notifyRefreshInputOptions(name, data);
  }

  public onInputOptionRefresh(
    name: keyof T,
    handler: (value: Record<string, string>) => void
  ): UnSubscribe {
    return this.createOnInputOptionRefresh(name, handler);
  }
}
