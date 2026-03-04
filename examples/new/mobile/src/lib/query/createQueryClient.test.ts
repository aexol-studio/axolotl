import { createQueryClient } from './createQueryClient';

describe('createQueryClient', () => {
  it('creates query client with starter defaults', () => {
    const client = createQueryClient();

    const defaults = client.getDefaultOptions();
    expect(defaults.queries?.staleTime).toBe(30_000);
    expect(defaults.queries?.retry).toBe(1);
    expect(defaults.queries?.refetchOnReconnect).toBe(true);
    expect(defaults.mutations?.retry).toBe(0);
  });
});
