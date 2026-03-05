import { PropsWithChildren, Suspense } from 'react'

import { LoadingState } from '../state/LoadingState'

type ListSuspenseBoundaryProps = PropsWithChildren<{
  loadingLabel: string
}>

export function ListSuspenseBoundary({
  children,
  loadingLabel,
}: ListSuspenseBoundaryProps) {
  return (
    <Suspense fallback={<LoadingState label={loadingLabel} />}>
      {children}
    </Suspense>
  )
}
