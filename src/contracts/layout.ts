import { DivProps } from './shared';
import { ComponentType } from 'react';
import { createDefaultContainer } from '../utils';

export type ViewMode = 'view' | 'edit';
export type BreakpointValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Breakpoints = {
  sm?: BreakpointValue;
  md?: BreakpointValue;
  lg?: BreakpointValue;
  xl?: BreakpointValue;
  '2xl'?: BreakpointValue;
};

export abstract class FormLayoutProcessor {
  private RootContainer: ComponentType<DivProps> = createDefaultContainer();
  private ItemContainer: ComponentType<DivProps> = createDefaultContainer();

  public setRootContainer(Component: ComponentType<DivProps>): void {
    this.RootContainer = Component;
  }

  public setItemContainer(Component: ComponentType<DivProps>): void {
    this.ItemContainer = Component;
  }

  public getContainer(type: 'root' | 'item'): ComponentType<DivProps> {
    if (type === 'item') return this.ItemContainer;
    return this.RootContainer;
  }

  abstract createBreakpointClasses(bp: Breakpoints | undefined): string;
}
