export function getRealtimeConfig() {
  return {
    key: process.env.EXPO_PUBLIC_PUSHER_KEY,
    cluster: process.env.EXPO_PUBLIC_PUSHER_CLUSTER,
  };
}

export function isRealtimeConfigured() {
  const config = getRealtimeConfig();
  return Boolean(config.key && config.cluster);
}
