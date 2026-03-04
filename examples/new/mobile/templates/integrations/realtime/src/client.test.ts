import {
  disconnectRealtimeClient,
  registerRealtimeClient,
  resetRealtimeClient,
  subscribeChannel,
  unsubscribeChannel,
} from './client';

describe('realtime template client', () => {
  afterEach(() => {
    resetRealtimeClient();
  });

  it('is no-op without configured client', () => {
    expect(() => subscribeChannel('updates')).not.toThrow();
    expect(() => unsubscribeChannel('updates')).not.toThrow();
    expect(() => disconnectRealtimeClient()).not.toThrow();
  });

  it('forwards calls when client exists', () => {
    const subscribe = jest.fn();
    const unsubscribe = jest.fn();
    const disconnect = jest.fn();

    registerRealtimeClient({ subscribe, unsubscribe, disconnect });

    subscribeChannel('updates');
    unsubscribeChannel('updates');
    disconnectRealtimeClient();

    expect(subscribe).toHaveBeenCalledWith('updates');
    expect(unsubscribe).toHaveBeenCalledWith('updates');
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
