export type SentryLike = {
  init?: (config: { dsn: string; environment: string }) => void;
};

let didInit = false;

export function resetSentrySetup() {
  didInit = false;
}

export function isSentrySetupInitialized() {
  return didInit;
}

export function setupSentry(sdk: SentryLike, config: { dsn: string; environment: string }) {
  if (didInit) {
    return;
  }

  sdk.init?.({
    dsn: config.dsn,
    environment: config.environment,
  });

  didInit = true;
}
