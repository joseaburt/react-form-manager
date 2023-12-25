import { useEffect, useState } from 'react';
import { ViewMode } from '../contracts/layout';
import { IStateManager } from '../contracts/state';
import { ErrorState } from '../contracts/validation/input-validation';

type UseBaseInputOptions = {
  defaultValue: any;
  defaultHidden?: boolean;
  defaultDisabled?: boolean;
  defaultViewMode?: ViewMode;
};

export function useCommonState<T>(name: keyof T, stateManager: IStateManager<T>, options: UseBaseInputOptions) {
  const { error } = useError<T>(name, stateManager);
  const { hidden } = useHidden<T>(name, stateManager, !!options.defaultHidden);
  const { viewMode } = useViewMode<T>(name, stateManager, options.defaultViewMode);
  const { value, setValue } = useValue<T>(name, stateManager, options.defaultValue);
  const { disabled } = useDisabled<T>(name, stateManager, !!options.defaultDisabled);
  return { value, setValue, disabled, error, viewMode, hidden };
}

export function useValue<T>(name: keyof T, stateManager: IStateManager<T>, defaultValue: any) {
  const [value, setValue] = useState<any>(defaultValue);
  useEffect(() => {
    const off = stateManager.onInputStateChange(name, value => setValue(value));
    return () => off();
  }, []);

  return { value, setValue };
}

export function useHidden<T>(name: keyof T, stateManager: IStateManager<T>, defaultHidden?: boolean) {
  const [hidden, setHidden] = useState(!!defaultHidden);
  useEffect(() => {
    const off = stateManager.onInputVisibilityChange(name, (value: boolean) => setHidden(value));
    return () => off();
  }, []);
  return { hidden, setHidden };
}

export function useDisabled<T>(name: keyof T, stateManager: IStateManager<T>, defaultDisabled?: boolean) {
  const [disabled, setDisabled] = useState(!!defaultDisabled);
  useEffect(() => {
    const off = stateManager.onInputDisabledChange(name, (value: boolean) => setDisabled(value));
    return () => off();
  }, []);
  return { disabled, setDisabled };
}

export function useViewMode<T>(name: keyof T, stateManager: IStateManager<T>, defaultViewMode?: ViewMode) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode ?? 'edit');
  useEffect(() => {
    const off = stateManager.onInputViewModeChange(name, (value: ViewMode) => setViewMode(value));
    return () => off();
  }, []);
  return { viewMode, setViewMode };
}

export function useError<T>(name: keyof T, stateManager: IStateManager<T>) {
  const [error, setError] = useState<ErrorState>({ error: false, message: '' });
  useEffect(() => {
    const off = stateManager.onInputValidationChange(name, (value: ErrorState) => setError(value));
    return () => off();
  }, []);
  return { error, setError };
}
