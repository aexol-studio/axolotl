// Main App component - Router wrapper
import AppRoutes from './routes';

export default function App() {
  console.log('API URL:', import.meta.env.VITE_API_URL); // Debug log for API URL
  return <AppRoutes />;
}
