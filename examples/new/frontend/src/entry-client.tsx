import './index.css';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { routeConfig } from './routes';

const browserRouter = createBrowserRouter(routeConfig);

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <RouterProvider router={browserRouter} />
  </StrictMode>,
);
