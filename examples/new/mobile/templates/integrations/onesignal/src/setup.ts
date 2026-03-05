export type OneSignalLike = {
  initialize?: (appId: string) => void;
  login?: (externalId: string) => void;
  logout?: () => void;
};

export function setupOneSignal(
  sdk: OneSignalLike,
  params: {
    appId: string;
    externalId?: string;
  },
) {
  sdk.initialize?.(params.appId);

  if (params.externalId) {
    sdk.login?.(params.externalId);
  }
}

export function teardownOneSignal(sdk: OneSignalLike) {
  sdk.logout?.();
}
