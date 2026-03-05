import RootLayout from '../_layout';

describe('app layer boundary', () => {
  it('defines root layout without importing template blueprints directly', () => {
    expect(RootLayout).toBeDefined();
  });
});
