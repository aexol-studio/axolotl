import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { AuthProvider } from './contexts/AuthContext';

interface RenderOptions {
  isAuthenticated: boolean;
}

export const render = (url: string, options: RenderOptions = { isAuthenticated: false }) => {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AuthProvider value={{ isAuthenticated: options.isAuthenticated }}>
          <App />
        </AuthProvider>
      </StaticRouter>
    </StrictMode>,
  );
  return { html };
};
