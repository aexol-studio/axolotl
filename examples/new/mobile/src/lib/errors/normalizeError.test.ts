import { normalizeError } from './normalizeError';

describe('normalizeError', () => {
  it('normalizes network-like errors', () => {
    const normalized = normalizeError({ code: 'network_error' });

    expect(normalized.code).toBe('NETWORK_ERROR');
    expect(normalized.message).toBe('common.errors.network');
  });

  it('normalizes validation errors', () => {
    const normalized = normalizeError({ code: 'validation_error', message: 'Invalid input' });

    expect(normalized.code).toBe('VALIDATION_ERROR');
    expect(normalized.message).toBe('Invalid input');
  });
});
