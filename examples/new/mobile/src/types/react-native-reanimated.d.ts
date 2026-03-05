declare module 'react-native-reanimated' {
  import type { ComponentType } from 'react'
  import type { ViewProps } from 'react-native'

  const Animated: {
    View: ComponentType<ViewProps>
  }

  export type SharedValue<T> = {
    value: T
  }

  export const useSharedValue: <T>(initial: T) => SharedValue<T>
  export const useAnimatedStyle: <T>(updater: () => T) => T
  export const withTiming: <T>(value: T, config?: { duration?: number }) => T

  export default Animated
}
