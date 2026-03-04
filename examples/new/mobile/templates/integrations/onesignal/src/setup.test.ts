import { setupOneSignal, teardownOneSignal } from './setup';

describe('one signal template setup', () => {
  it('initializes sdk and logs in when external id exists', () => {
    const initialize = jest.fn();
    const login = jest.fn();
    const sdk = { initialize, login };

    setupOneSignal(sdk, {
      appId: 'app-id',
      externalId: 'user-1',
    });

    expect(initialize).toHaveBeenCalledWith('app-id');
    expect(login).toHaveBeenCalledWith('user-1');
  });

  it('tears down sdk session', () => {
    const logout = jest.fn();

    teardownOneSignal({ logout });

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
