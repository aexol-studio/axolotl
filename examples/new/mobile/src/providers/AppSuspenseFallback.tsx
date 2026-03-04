import { LoadingState } from '../components/state';

export function AppSuspenseFallback() {
  return <LoadingState label="Loading..." />;
}
