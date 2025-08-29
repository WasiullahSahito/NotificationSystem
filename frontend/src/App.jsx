import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import TemplatesPage from './pages/TemplatesPage'; // <--- THIS IS THE MISSING LINE
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import Spinner from './components/ui/Spinner';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="templates" element={<TemplatesPage />} />
      </Route>

      <Route path="/login" element={token ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={token ? <Navigate to="/" /> : <RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;