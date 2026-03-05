import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import type { SpotlightRect, SpotlightStep } from './types'

type SpotlightContextValue = {
  steps: readonly SpotlightStep[]
  isVisible: boolean
  currentStepIndex: number
  currentStep: SpotlightStep | null
  currentRect: SpotlightRect | null
  isFirstStep: boolean
  isLastStep: boolean
  start: (steps: readonly SpotlightStep[]) => void
  close: () => void
  next: () => void
  previous: () => void
  registerTarget: (id: string, rect: SpotlightRect) => void
}

const SpotlightContext = createContext<SpotlightContextValue | null>(null)

export const SpotlightProvider = ({ children }: PropsWithChildren) => {
  const [steps, setSteps] = useState<readonly SpotlightStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [targetMap, setTargetMap] = useState<Record<string, SpotlightRect>>({})

  const start = useCallback((nextSteps: readonly SpotlightStep[]) => {
    setSteps(nextSteps)
    setCurrentStepIndex(0)
    setIsVisible(nextSteps.length > 0)
  }, [])

  const close = useCallback(() => {
    setIsVisible(false)
  }, [])

  const next = useCallback(() => {
    setCurrentStepIndex((current) => Math.min(current + 1, steps.length - 1))
  }, [steps.length])

  const previous = useCallback(() => {
    setCurrentStepIndex((current) => Math.max(current - 1, 0))
  }, [])

  const registerTarget = useCallback((id: string, rect: SpotlightRect) => {
    setTargetMap((current) => ({
      ...current,
      [id]: rect,
    }))
  }, [])

  const currentStep = steps[currentStepIndex] ?? null
  const currentRect = currentStep
    ? (targetMap[currentStep.targetId] ?? null)
    : null

  const value = useMemo<SpotlightContextValue>(
    () => ({
      steps,
      isVisible,
      currentStepIndex,
      currentStep,
      currentRect,
      isFirstStep: currentStepIndex === 0,
      isLastStep: steps.length > 0 && currentStepIndex === steps.length - 1,
      start,
      close,
      next,
      previous,
      registerTarget,
    }),
    [
      close,
      currentRect,
      currentStep,
      currentStepIndex,
      isVisible,
      next,
      previous,
      registerTarget,
      start,
      steps,
    ],
  )

  return (
    <SpotlightContext.Provider value={value}>
      {children}
    </SpotlightContext.Provider>
  )
}

export const useSpotlight = () => {
  const context = useContext(SpotlightContext)
  if (!context) {
    throw new Error('useSpotlight must be used inside SpotlightProvider')
  }

  return context
}
