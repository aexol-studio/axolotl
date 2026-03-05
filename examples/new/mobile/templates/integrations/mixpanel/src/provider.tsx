import { PropsWithChildren, useEffect } from 'react';

import { getMixpanelConfig, isMixpanelConfigured } from './config';
import { registerMixpanelClient } from './client';

type MixpanelFactory = (token: string) => Promise<{
  identify?: (id: string) => Promise<void> | void;
  track?: (event: string, props?: Record<string, unknown>) => Promise<void> | void;
  setProfile?: (profile: Record<string, unknown>) => Promise<void> | void;
}>;

type MixpanelTemplateProviderProps = PropsWithChildren<{
  createClient?: MixpanelFactory;
}>;

async function defaultMixpanelFactory(_token: string) {
  return {};
}

export function MixpanelTemplateProvider({
  children,
  createClient = defaultMixpanelFactory,
}: MixpanelTemplateProviderProps) {
  useEffect(() => {
    let active = true;

    async function setup() {
      const config = getMixpanelConfig();
      if (!isMixpanelConfigured() || !config.token) {
        return;
      }

      try {
        const client = await createClient(config.token);
        if (!active) {
          return;
        }
        registerMixpanelClient(client);
      } catch {
        // no-op blueprint behavior
      }
    }

    void setup();

    return () => {
      active = false;
    };
  }, [createClient]);

  return <>{children}</>;
}
