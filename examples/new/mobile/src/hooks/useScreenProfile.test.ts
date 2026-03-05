import { renderHook } from '@testing-library/react-native'
import * as reactNative from 'react-native'

import { useScreenProfile } from './useScreenProfile'

const mockUseWindowDimensions = jest.spyOn(reactNative, 'useWindowDimensions')

describe('useScreenProfile', () => {
  afterEach(() => {
    mockUseWindowDimensions.mockReset()
  })

  it('returns phoneCompact for narrow screens', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 320,
      height: 640,
      scale: 2,
      fontScale: 1,
    })

    const { result } = renderHook(() => useScreenProfile())

    expect(result.current.screenProfile).toBe('phoneCompact')
    expect(result.current.viewportRatio).toBeCloseTo(0.9)
  })

  it('returns phone for default phone dimensions', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 390,
      height: 844,
      scale: 3,
      fontScale: 1,
    })

    const { result } = renderHook(() => useScreenProfile())

    expect(result.current.screenProfile).toBe('phone')
    expect(result.current.viewportRatio).toBeCloseTo(1)
  })

  it('returns tablet for larger screens', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 834,
      height: 1194,
      scale: 2,
      fontScale: 1,
    })

    const { result } = renderHook(() => useScreenProfile())

    expect(result.current.screenProfile).toBe('tablet')
    expect(result.current.viewportRatio).toBeCloseTo(1.2)
  })
})
