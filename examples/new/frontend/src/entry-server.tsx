import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { AuthProvider } from './contexts/AuthContext';
import type { TranslationMap } from '@aexol/dynamite/server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_LOCALE = 'en';

/**
 * Load translations from the public locales directory for SSR.
 *
 * We use a custom loader instead of `loadTranslations` from `@aexol/dynamite/server`
 * because the library expects a flat `{localesDir}/{locale}.json` layout, while this
 * project uses a subfolder structure: `locales/{locale}/common.json`.
 *
 * Falls back to an empty object if the file doesn't exist yet — since English
 * text IS the translation key in dynamite, `t()` returns the key itself when
 * no translation is found, so missing translations are harmless.
 */
const LOCALE_CANDIDATE_DIRS = [
  // Dev: relative to frontend/src/entry-server.tsx -> ../public/locales
  path.resolve(__dirname, '../public/locales'),
  // Prod: relative to dist/server/entry-server.js -> ../../dist/client/locales
  path.resolve(__dirname, '../../dist/client/locales'),
  // Fallback: from CWD (typically project root)
  path.resolve(process.cwd(), 'frontend/public/locales'),
];

const loadServerTranslations = (locale: string): TranslationMap => {
  for (const dir of LOCALE_CANDIDATE_DIRS) {
    const filePath = path.join(dir, locale, 'common.json');
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as TranslationMap;
      }
    } catch {
      // Try next candidate path
    }
  }
  return {};
};

interface RenderOptions {
  isAuthenticated: boolean;
  locale?: string;
}

export const render = (url: string, options: RenderOptions = { isAuthenticated: false }) => {
  const locale = options.locale ?? DEFAULT_LOCALE;
  const translations = loadServerTranslations(locale);

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AuthProvider value={{ isAuthenticated: options.isAuthenticated }}>
          <App initialTranslations={translations} initialLocale={locale} />
        </AuthProvider>
      </StaticRouter>
    </StrictMode>,
  );

  return { html, translations, locale };
};
