import React from 'react';
import { DivProps } from '../contracts/shared';
import { ComponentType, forwardRef } from 'react';

export function createDefaultContainer(): ComponentType<DivProps> {
  return forwardRef<HTMLDivElement, DivProps>((props, ref) => (
    <div {...props} ref={ref} />
  ));
}
