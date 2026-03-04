import { renderHook } from '@testing-library/react-native';

import { useScreenProfile } from './useScreenProfile';

const mockUseWindowDimensionsValue = jest.fn();

jest.mock('./useWindowDimensionsValue', () => ({
  useWindowDimensionsValue: () => mockUseWindowDimensionsValue(),
}));

describe('useScreenProfile', () => {
  afterEach(() => {
    mockUseWindowDimensionsValue.mockReset();
  });

  it('returns phoneCompact for narrow screens', () => {
    mockUseWindowDimensionsValue.mockReturnValue({ width: 320, height: 640, scale: 2, fontScale: 1 });

    const { result } = renderHook(() => useScreenProfile());

    expect(result.current.screenProfile).toBe('phoneCompact');
    expect(result.current.viewportRatio).toBeCloseTo(0.9);
  });

  it('returns phone for default phone dimensions', () => {
    mockUseWindowDimensionsValue.mockReturnValue({ width: 390, height: 844, scale: 3, fontScale: 1 });

    const { result } = renderHook(() => useScreenProfile());

    expect(result.current.screenProfile).toBe('phone');
    expect(result.current.viewportRatio).toBeCloseTo(1);
  });

  it('returns tablet for larger screens', () => {
    mockUseWindowDimensionsValue.mockReturnValue({ width: 834, height: 1194, scale: 2, fontScale: 1 });

    const { result } = renderHook(() => useScreenProfile());

    expect(result.current.screenProfile).toBe('tablet');
    expect(result.current.viewportRatio).toBeCloseTo(1.2);
  });
});
