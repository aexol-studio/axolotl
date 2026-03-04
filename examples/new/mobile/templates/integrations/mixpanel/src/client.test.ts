import { identifyUser, registerMixpanelClient, resetMixpanelClient, setUserProfile, trackEvent } from './client';

describe('mixpanel template client', () => {
  afterEach(() => {
    resetMixpanelClient();
  });

  it('is no-op without configured client', async () => {
    await expect(trackEvent('event')).resolves.toBeUndefined();
    await expect(identifyUser('user-1')).resolves.toBeUndefined();
    await expect(setUserProfile({ role: 'starter' })).resolves.toBeUndefined();
  });

  it('forwards calls when client exists', async () => {
    const identify = jest.fn();
    const track = jest.fn();
    const setProfile = jest.fn();

    registerMixpanelClient({ identify, track, setProfile });

    await identifyUser('user-2');
    await trackEvent('screen.viewed', { screen: 'home' });
    await setUserProfile({ plan: 'free' });

    expect(identify).toHaveBeenCalledWith('user-2');
    expect(track).toHaveBeenCalledWith('screen.viewed', { screen: 'home' });
    expect(setProfile).toHaveBeenCalledWith({ plan: 'free' });
  });
});
