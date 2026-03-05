import { PropsWithChildren, useRef } from 'react'
import { View } from 'react-native'

import { useSpotlight } from './SpotlightContext'

type SpotlightTargetProps = PropsWithChildren<{
  id: string
  testID?: string
}>

export const SpotlightTarget = ({
  id,
  testID,
  children,
}: SpotlightTargetProps) => {
  const hostRef = useRef<View | null>(null)
  const { registerTarget } = useSpotlight()

  const handleLayout = () => {
    hostRef.current?.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        registerTarget(id, { x, y, width, height })
      },
    )
  }

  return (
    <View ref={hostRef} testID={testID} onLayout={handleLayout}>
      {children}
    </View>
  )
}
