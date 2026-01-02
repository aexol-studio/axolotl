// Route configuration
import { Routes, Route } from 'react-router';
import Landing from './Landing';
import Dashboard from './Dashboard';
import AdminLayout from './admin/Layout';
import AdminDashboard from './admin/index';
import AdminUsers from './admin/Users';
import AdminSettings from './admin/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing page - SSR enabled */}
      <Route path="/" element={<Landing />} />

      {/* Main app dashboard - SPA */}
      <Route path="/app" element={<Dashboard />} />

      {/* Admin panel routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
