import { DivProps } from './shared';
import { ComponentType } from 'react';
import { IStateManager } from './state';
import { InputProps, ViewComponent } from './props';
import { InputConfiguration } from './configurations';

export type ReturnComponentProps<C, T> = {
  defaultValue: any;
  stateManager: IStateManager<T>;
  ViewComponent: ViewComponent<T>;
  Container: ComponentType<DivProps>;
} & Omit<C, 'type' | 'customViewModeFactory' | 'validationRules' | 'breakpoints'>;

/**
 * ### Input Adapter
 *
 * This framework structures the communication of a form components in a
 * given way and required all Inputs connect to a EventBus to listen and update
 * its states. So for that reason is required to adapt a Input for be compatible
 * with this design. Inputs can be agnostic and is not required they couple this
 * implementation, they just need to follow the standard interface of a react
 * form Input.
 *
 * @author <pino0071@gmail.com> Jose Aburto
 * @version 0.0.1
 */
export abstract class InputAdapter<T, C extends InputConfiguration<T>, P extends InputProps<T, any>> {
  /**
   * Any Input requires a different state, so any adapter should represent the needs of those Input.
   * @param Input - The input that is about to be adapted.
   */
  abstract adapt(Input: ComponentType<P>): ComponentType<ReturnComponentProps<C, T>>;
}

//
