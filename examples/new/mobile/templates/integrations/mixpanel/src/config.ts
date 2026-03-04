export function getMixpanelConfig() {
  return {
    token: process.env.EXPO_PUBLIC_MIXPANEL_TOKEN,
  };
}

export function isMixpanelConfigured() {
  return Boolean(getMixpanelConfig().token);
}
