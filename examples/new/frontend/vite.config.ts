import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import devTranslate, { Languages } from '@aexol/vite-plugin-dev-translate';
import path from 'path';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(process.env.DEV_TRANSLATE_API_KEY?.trim()
      ? [
          devTranslate({
            apiKey: process.env.DEV_TRANSLATE_API_KEY.trim(),
            lang: Languages.ENGB,
            localeDir: 'frontend/public/locales',
            folderName: 'en',
          }),
        ]
      : [
          {
            name: 'dev-translate-disabled-info',
            configResolved() {
              console.info('[dev-translate] Turned off: DEV_TRANSLATE_API_KEY was not provided.');
            },
          },
        ]),
  ],
  root: path.resolve(__dirname, '.'),
  build: {
    outDir: isSsrBuild ? path.resolve(__dirname, '../dist/server') : path.resolve(__dirname, '../dist/client'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Proxy API requests to the backend during standalone Vite dev
    proxy: {
      '/graphql': 'http://localhost:4102',
    },
    hmr: {
      port: 24702,
    },
  },
}));
