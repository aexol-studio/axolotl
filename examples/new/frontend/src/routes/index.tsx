import { Routes, Route } from 'react-router';
import { GuestLayout } from './guest/index.js';
import { ProtectedLayout } from './protected/index.js';
import { Landing } from './guest/landing/index.js';
import { Login } from './guest/login/index.js';
import { Dashboard } from './protected/dashboard/index.js';
import { Settings } from './protected/settings/index.js';
import { Examples } from './public/examples/index.js';
import { NotFound } from './not-found/index.js';

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
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
