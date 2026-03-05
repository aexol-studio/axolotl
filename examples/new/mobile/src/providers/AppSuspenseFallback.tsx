import { LoadingState } from '../components/state/LoadingState'

export function AppSuspenseFallback() {
  return <LoadingState label="Loading..." />
}
