import './index.css';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import { AuthProvider } from './contexts/AuthContext';

const initialAuth = window.__INITIAL_AUTH__ ?? { isAuthenticated: false };

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <BrowserRouter>
      <AuthProvider value={initialAuth}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
