export function getOneSignalConfig() {
  return {
    appId: process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID,
  };
}

export function isOneSignalConfigured() {
  return Boolean(getOneSignalConfig().appId);
}
