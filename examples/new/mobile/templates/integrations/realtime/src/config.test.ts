describe('realtime template config', () => {
  afterEach(() => {
    delete process.env.EXPO_PUBLIC_PUSHER_KEY;
    delete process.env.EXPO_PUBLIC_PUSHER_CLUSTER;
  });

  it('returns disabled when key or cluster is missing', () => {
    const { isRealtimeConfigured } = require('./config') as typeof import('./config');

    expect(isRealtimeConfigured()).toBe(false);
  });

  it('returns enabled when key and cluster exist', () => {
    process.env.EXPO_PUBLIC_PUSHER_KEY = 'pusher-key';
    process.env.EXPO_PUBLIC_PUSHER_CLUSTER = 'eu';
    const { getRealtimeConfig, isRealtimeConfigured } = require('./config') as typeof import('./config');

    expect(isRealtimeConfigured()).toBe(true);
    expect(getRealtimeConfig()).toEqual({
      key: 'pusher-key',
      cluster: 'eu',
    });
  });
});
