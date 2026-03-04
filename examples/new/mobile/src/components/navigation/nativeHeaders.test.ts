import { createNativeHeaderOptions } from './nativeHeaders';

describe('createNativeHeaderOptions', () => {
  it('builds default large-title options', () => {
    const options = createNativeHeaderOptions({ title: 'Home' });

    expect(options).toEqual({
      title: 'Home',
      headerLargeTitle: true,
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    });
  });

  it('allows disabling large title', () => {
    const options = createNativeHeaderOptions({ title: 'Sign in', largeTitle: false });

    expect(options.headerLargeTitle).toBe(false);
  });
});
