import { PropsWithChildren, useEffect } from 'react';

import { getOneSignalConfig, isOneSignalConfigured } from './config';
import { setupOneSignal, teardownOneSignal, type OneSignalLike } from './setup';

type OneSignalTemplateProviderProps = PropsWithChildren<{
  userId?: string;
  sdk?: OneSignalLike;
}>;

let cachedSdk: OneSignalLike | null = null;

async function loadSdk() {
  if (cachedSdk) {
    return cachedSdk;
  }

  cachedSdk = {};
  return cachedSdk;
}

export function OneSignalTemplateProvider({ children, userId, sdk }: OneSignalTemplateProviderProps) {
  useEffect(() => {
    let active = true;
    let resolvedSdk: OneSignalLike | null = null;

    async function setup() {
      const config = getOneSignalConfig();
      if (!isOneSignalConfigured() || !config.appId) {
        return;
      }

      try {
        resolvedSdk = sdk ?? (await loadSdk());
        if (!active || !resolvedSdk) {
          return;
        }

        setupOneSignal(resolvedSdk, {
          appId: config.appId,
          externalId: userId,
        });
      } catch {
        // no-op blueprint behavior
      }
    }

    void setup();

    return () => {
      active = false;
      if (resolvedSdk) {
        teardownOneSignal(resolvedSdk);
      }
    };
  }, [sdk, userId]);

  return <>{children}</>;
}
