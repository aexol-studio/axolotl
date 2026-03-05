export type RealtimeLike = {
  subscribe?: (channel: string) => void;
  unsubscribe?: (channel: string) => void;
  disconnect?: () => void;
};

let client: RealtimeLike | null = null;

export function registerRealtimeClient(nextClient: RealtimeLike) {
  client = nextClient;
}

export function resetRealtimeClient() {
  client = null;
}

export function subscribeChannel(channel: string) {
  client?.subscribe?.(channel);
}

export function unsubscribeChannel(channel: string) {
  client?.unsubscribe?.(channel);
}

export function disconnectRealtimeClient() {
  client?.disconnect?.();
}
