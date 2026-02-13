import { Routes, Route } from 'react-router';
import { GuestLayout } from './guest';
import { ProtectedLayout } from './protected';
import { Landing } from './guest/landing';
import { Login } from './guest/login/index.js';
import { Dashboard } from './protected/dashboard';
import { Settings } from './protected/settings';
import { Examples } from './public/examples';
import { NotFound } from './not-found';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Guest-only — redirect to /app if already authenticated */}
      <Route element={<GuestLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Public — no auth check */}
      <Route path="/examples" element={<Examples />} />

      {/* Protected — redirect to / if not authenticated */}
      <Route element={<ProtectedLayout />}>
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/settings" element={<Settings />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
