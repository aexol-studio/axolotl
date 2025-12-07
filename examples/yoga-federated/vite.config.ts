import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  root: path.resolve(__dirname, 'frontend'),
  build: {
    outDir: isSsrBuild ? path.resolve(__dirname, 'dist/server') : path.resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
  },
  server: {
    // Proxy API requests to the backend during standalone Vite dev
    proxy: {
      '/graphql': 'http://localhost:4002',
    },
  },
}));
