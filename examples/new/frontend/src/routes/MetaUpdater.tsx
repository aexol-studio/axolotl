import { useEffect } from 'react';
import { useMatches } from 'react-router';
import { type RouteMeta, isRouteMeta } from './meta';

export const MetaUpdater = () => {
  const matches = useMatches();
  useEffect(() => {
    const meta = matches.reduceRight<RouteMeta | null>((found, match) => {
      if (found) return found;
      const d = match.data;
      if (d !== null && typeof d === 'object' && 'meta' in d) {
        if (isRouteMeta(d.meta)) return d.meta;
      }
      return null;
    }, null);
    if (meta?.title) document.title = meta.title;
  }, [matches]);
  return null;
};
