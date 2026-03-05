import { useMemo } from 'react'
import * as reactNative from 'react-native'

import { getViewportRatio, resolveScreenProfile } from '../config/mainConfig'

export function useScreenProfile() {
  const { width, height } = reactNative.useWindowDimensions()

  return useMemo(
    () => ({
      screenProfile: resolveScreenProfile(width, height),
      viewportRatio: getViewportRatio(width, height),
    }),
    [height, width],
  )
}
