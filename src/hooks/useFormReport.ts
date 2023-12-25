import { FormManager } from '../manager';
import { useEffect, useState } from 'react';
import { FormStateReport } from '../contracts/state';

export function useFormReport<T>(
  manager: FormManager<T>
): Omit<FormStateReport<T>, 'state'> {
  const [state, setState] = useState<Omit<FormStateReport<T>, 'state'>>({
    debug: 'Everything is ok 👌🏽👏🏽',
    isValid: true,
    changes: {},
    touchedFields: {},
    hasChanged: false,
    errors: {},
  });

  useEffect(() => {
    const off = manager.getRepository().onFormStateChange(setState);
    return () => off();
  }, []);

  return state;
}
