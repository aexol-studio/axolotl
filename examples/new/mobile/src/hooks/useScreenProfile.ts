import { useMemo } from 'react';

import { getViewportRatio, resolveScreenProfile } from '../config/mainConfig';
import { useWindowDimensionsValue } from './useWindowDimensionsValue';

export function useScreenProfile() {
  const { width, height } = useWindowDimensionsValue();

  return useMemo(
    () => ({
      screenProfile: resolveScreenProfile(width, height),
      viewportRatio: getViewportRatio(width, height),
    }),
    [height, width],
  );
}
