type MixpanelLike = {
  identify?: (id: string) => Promise<void> | void;
  track?: (event: string, props?: Record<string, unknown>) => Promise<void> | void;
  setProfile?: (profile: Record<string, unknown>) => Promise<void> | void;
};

let sdkClient: MixpanelLike | null = null;

export function registerMixpanelClient(client: MixpanelLike) {
  sdkClient = client;
}

export function resetMixpanelClient() {
  sdkClient = null;
}

export async function identifyUser(userId: string) {
  if (!sdkClient?.identify) {
    return;
  }

  await sdkClient.identify(userId);
}

export async function trackEvent(event: string, props?: Record<string, unknown>) {
  if (!sdkClient?.track) {
    return;
  }

  await sdkClient.track(event, props);
}

export async function setUserProfile(profile: Record<string, unknown>) {
  if (!sdkClient?.setProfile) {
    return;
  }

  await sdkClient.setProfile(profile);
}
