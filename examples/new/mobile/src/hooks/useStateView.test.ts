import { renderHook } from '@testing-library/react-native';

import { useStateView } from './useStateView';

describe('useStateView', () => {
  it('prioritizes explicit mode', () => {
    const { result } = renderHook(() => useStateView({ mode: 'error', isLoading: true }));
    expect(result.current).toBe('error');
  });

  it('falls back to success for non-empty data', () => {
    const { result } = renderHook(() => useStateView({ data: ['item'] }));
    expect(result.current).toBe('success');
  });
});
