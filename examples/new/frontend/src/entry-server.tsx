import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function render(_url: string) {
  const html = renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  return { html };
}
