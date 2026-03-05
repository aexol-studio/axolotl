import { useMemo } from 'react';

type StateViewMode = 'loading' | 'error' | 'empty' | 'success';

type StateViewOptions<TData> = {
  mode?: StateViewMode;
  isLoading?: boolean;
  error?: unknown;
  data?: TData | null;
  isEmpty?: (data: TData | null | undefined) => boolean;
};

export function useStateView<TData>(options: StateViewOptions<TData>) {
  return useMemo<StateViewMode>(() => {
    if (options.mode) {
      return options.mode;
    }

    if (options.isLoading) {
      return 'loading';
    }

    if (options.error) {
      return 'error';
    }

    const isEmpty = options.isEmpty ?? ((value) => value == null);
    if (isEmpty(options.data)) {
      return 'empty';
    }

    return 'success';
  }, [options]);
}
