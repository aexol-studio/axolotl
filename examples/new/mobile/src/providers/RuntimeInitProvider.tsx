import { PropsWithChildren, useEffect } from 'react';

import { initI18n } from '../lib/i18n';
import { initThemeBase } from '../theme';

type RuntimeInitProviderProps = PropsWithChildren<{
  runOnMount?: () => Promise<void> | void;
}>;

export function runRuntimeInit() {
  initThemeBase();
  return initI18n();
}

export function RuntimeInitProvider({ children, runOnMount }: RuntimeInitProviderProps) {
  useEffect(() => {
    async function init() {
      try {
        if (runOnMount) {
          await runOnMount();
          return;
        }

        await runRuntimeInit();
      } catch {
        // fail-safe startup: init issues should not block first render
      }
    }

    void init();
  }, [runOnMount]);

  return <>{children}</>;
}
