export interface RouteMeta {
  title?: string;
  description?: string;
  'og:title'?: string;
  'og:description'?: string;
}

interface MatchWithData {
  data?: unknown;
}

const isRouteMeta = (v: unknown): v is RouteMeta => v !== null && typeof v === 'object';

const escapeHtml = (str: string): string =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export { isRouteMeta };

export const buildMetaHead = (matches: MatchWithData[]): string => {
  const meta = matches.reduceRight<RouteMeta | null>((found, match) => {
    if (found) return found;
    const d = match.data;
    if (d !== null && typeof d === 'object' && 'meta' in d) {
      if (isRouteMeta(d.meta)) return d.meta;
    }
    return null;
  }, null);

  if (!meta) return '';
  const tags: string[] = [];
  if (meta.title) tags.push(`<title>${escapeHtml(meta.title)}</title>`);
  if (meta.description) tags.push(`<meta name="description" content="${escapeHtml(meta.description)}" />`);
  if (meta['og:title']) tags.push(`<meta property="og:title" content="${escapeHtml(meta['og:title'])}" />`);
  if (meta['og:description'])
    tags.push(`<meta property="og:description" content="${escapeHtml(meta['og:description'])}" />`);
  return tags.join('\n  ');
};
