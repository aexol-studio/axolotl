import { Outlet, redirect } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { isAuthenticated, type AppLoadContext } from '../../lib/queryClient.js';

export const protectedLoader = ({ context }: LoaderFunctionArgs) => {
  const qc = (context as AppLoadContext | undefined)?.queryClient;
  if (!isAuthenticated(qc)) return redirect('/login');
  return null;
};

export const ProtectedLayout = () => <Outlet />;
