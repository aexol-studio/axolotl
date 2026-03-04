import { PropsWithChildren, useEffect } from 'react';

import { getRealtimeConfig, isRealtimeConfigured } from './config';
import { disconnectRealtimeClient, registerRealtimeClient, type RealtimeLike } from './client';

type RealtimeClientFactory = (config: { key: string; cluster: string }) => Promise<RealtimeLike>;

type RealtimeTemplateProviderProps = PropsWithChildren<{
  createClient?: RealtimeClientFactory;
}>;

async function defaultRealtimeFactory(_config: { key: string; cluster: string }) {
  return {};
}

export function RealtimeTemplateProvider({
  children,
  createClient = defaultRealtimeFactory,
}: RealtimeTemplateProviderProps) {
  useEffect(() => {
    let active = true;

    async function setup() {
      const config = getRealtimeConfig();
      if (!isRealtimeConfigured() || !config.key || !config.cluster) {
        return;
      }

      try {
        const realtimeClient = await createClient({
          key: config.key,
          cluster: config.cluster,
        });

        if (!active) {
          return;
        }

        registerRealtimeClient(realtimeClient);
      } catch {
        // no-op blueprint behavior
      }
    }

    void setup();

    return () => {
      active = false;
      disconnectRealtimeClient();
    };
  }, [createClient]);

  return <>{children}</>;
}
