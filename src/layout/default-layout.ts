import { FormLayoutProcessor, Breakpoints } from '../contracts/layout';

export class DefaultFormLayoutProcessor extends FormLayoutProcessor {
  public createBreakpointClasses(bp: Breakpoints | undefined): string {
    return 'default-layout-processor';
  }
}
