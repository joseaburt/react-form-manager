import { StateManager } from './state';
import React, { ComponentType } from 'react';
import FormEventBus from './state/event-bus';
import { ViewComponent } from './contracts/props';
import { LoggerFunc, DivProps } from './contracts/shared';
import { ReturnComponentProps } from './contracts/adapter';
import { InputConfiguration } from './contracts/configurations';
import { DefaultFormLayoutProcessor } from './layout/default-layout';
import { IValidator } from './contracts/validation/input-validation';
import { Breakpoints, FormLayoutProcessor } from './contracts/layout';
import { IStateManager, InputConfigurationsState } from './contracts/state';

export class FormManager<
  T,
  Configurations extends { type: string } & InputConfiguration<T> = any
> {
  private readonly bus: FormEventBus;
  private readonly stateManager: IStateManager<T>;
  private readonly inputConfigurations: InputConfigurationsState<
    T,
    Configurations
  >;

  constructor({
    defaultState,
    configurations,
    bus,
  }: {
    defaultState: T;
    configurations: InputConfigurationsState<T, Configurations>;
    bus?: FormEventBus;
  }) {
    this.bus = bus ?? new FormEventBus();
    this.inputConfigurations = configurations;
    this.stateManager = new StateManager<T>({
      bus: this.bus,
      inputConfigurations: this.inputConfigurations,
      state: defaultState,
      validator: FormManager.validator,
      logger: FormManager.logger,
    });
  }

  // ===================================================================

  private adaptContainer(
    ItemContainer: ComponentType<DivProps>,
    formLayout: FormLayoutProcessor,
    breakpoints?: Breakpoints
  ): ComponentType<DivProps> {
    return function Container({ children, ...props }: DivProps): JSX.Element {
      return (
        <ItemContainer
          {...props}
          className={formLayout.createBreakpointClasses(breakpoints)}
        >
          {children}
        </ItemContainer>
      );
    };
  }

  // Use Factory Pattern

  public createFormInput(props?: DivProps): JSX.Element {
    const self = this;
    const formLayout = FormManager.formLayout;
    const RootContainer = formLayout.getContainer('root');
    const ItemContainer = formLayout.getContainer('item');

    function FormInputWithLayout(): JSX.Element {
      return (
        <RootContainer {...props}>
          {Object.keys(self.inputConfigurations).map((key: string) => {
            const { breakpoints, type, ...props } =
              self.inputConfigurations[key as keyof T];
            const Component = FormManager.resolveComponent(type);
            const ViewComponent = FormManager.resolveView(type);
            const Container = self.adaptContainer(
              ItemContainer,
              formLayout,
              breakpoints
            );
            const defaultState = self.stateManager.getData()[key as keyof T];
            return (
              <Component
                key={key}
                {...props}
                stateManager={self.stateManager}
                Container={Container}
                ViewComponent={ViewComponent}
                defaultValue={defaultState}
              />
            );
          })}
        </RootContainer>
      );
    }

    return <FormInputWithLayout />;
  }

  public createFormInputWithLayout(
    customFormLayout?: FormLayoutProcessor
  ): JSX.Element {
    const self = this;
    const formLayout = customFormLayout ?? FormManager.formLayout;
    const RootContainer = formLayout.getContainer('root');
    const ItemContainer = formLayout.getContainer('item');

    function FormInputWithLayout(): JSX.Element {
      return (
        <RootContainer>
          {Object.keys(self.inputConfigurations).map((key: string) => {
            const { breakpoints, type, ...props } =
              self.inputConfigurations[key as keyof T];
            const Component = FormManager.resolveComponent(type);
            const ViewComponent = FormManager.resolveView(type);
            const Container = self.adaptContainer(
              ItemContainer,
              formLayout,
              breakpoints
            );
            const defaultState = self.stateManager.getData()[key as keyof T];
            return (
              <Component
                key={key}
                {...props}
                stateManager={self.stateManager}
                Container={Container}
                ViewComponent={ViewComponent}
                defaultValue={defaultState}
              />
            );
          })}
        </RootContainer>
      );
    }

    return <FormInputWithLayout />;
  }

  public createFormInputWithOnly(
    names: (keyof T)[],
    customFormLayout?: FormLayoutProcessor
  ): JSX.Element {
    const self = this;
    const keys: string[] = names as string[];
    const formLayout = customFormLayout ?? FormManager.formLayout;
    const RootContainer = formLayout.getContainer('root');
    const ItemContainer = formLayout.getContainer('item');

    function FormInputWithLayout(): JSX.Element {
      return (
        <RootContainer>
          {Object.keys(self.inputConfigurations)
            .filter((key) => keys.includes(key))
            .map((key: string) => {
              const { breakpoints, type, ...props } =
                self.inputConfigurations[key as keyof T];
              const Component = FormManager.resolveComponent(type);
              const ViewComponent = FormManager.resolveView(type);
              const Container = self.adaptContainer(
                ItemContainer,
                formLayout,
                breakpoints
              );
              const defaultState = self.stateManager.getData()[key as keyof T];
              return (
                <Component
                  key={key}
                  {...props}
                  stateManager={self.stateManager}
                  Container={Container}
                  ViewComponent={ViewComponent}
                  defaultValue={defaultState}
                />
              );
            })}
        </RootContainer>
      );
    }

    return <FormInputWithLayout />;
  }

  public getRepository(): IStateManager<T> {
    return this.stateManager;
  }

  // =================================================================================================================================================
  // CLASS LEVEL STATE (GLOBAL CONFIGURATIONS)
  // =================================================================================================================================================

  private static validator: IValidator;
  private static logger: LoggerFunc = () => {};
  private static formLayout: FormLayoutProcessor =
    new DefaultFormLayoutProcessor();

  private static registeredViews = new Map<string, ViewComponent<any>>();
  private static registeredInputs = new Map<
    string,
    ComponentType<ReturnComponentProps<any, any>>
  >();

  public static registerController<
    GivenInputConfiguration extends { type: string }
  >(
    type: GivenInputConfiguration['type'],
    Input: any,
    View: ViewComponent<any>
  ) {
    this.registeredViews.set(type, View);
    this.registeredInputs.set(type, Input);
    return this;
  }

  public static registerValidator(validator: IValidator) {
    this.validator = validator;
    return this;
  }

  public static defineInputConfigurations<T, C>(
    inputConfigurations: InputConfigurationsState<T, C>
  ): InputConfigurationsState<T, C> {
    return inputConfigurations;
  }

  public static registerFormLayoutProcessor(formLayout: FormLayoutProcessor) {
    this.formLayout = formLayout;
    return this;
  }

  public static resolveView(type: string): ViewComponent<unknown> {
    const View = this.registeredViews.get(type);
    // eslint-disable-next-line react/display-name, react/no-unescaped-entities
    if (!View)
      return (): JSX.Element => <>"{type as string}" view is not registered!</>;
    return View;
  }

  public static resolveComponent(
    type: string
  ): ComponentType<ReturnComponentProps<any, any>> {
    const Component = this.registeredInputs.get(type);
    // eslint-disable-next-line react/display-name, react/no-unescaped-entities
    if (!Component)
      return (): JSX.Element => (
        <>"{type as string}" input is not registered!</>
      );
    return Component;
  }

  public static registerLogger(logger: LoggerFunc) {
    if (typeof logger !== 'function') {
      console.error('[FormManager]: Logger should be a function.');
      return this;
    }
    this.logger = logger;
    return this;
  }

  public static startInitConfigurations() {
    return this;
  }
}
