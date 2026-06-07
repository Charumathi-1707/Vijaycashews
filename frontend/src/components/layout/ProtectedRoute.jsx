import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { LoadingScreen } from '../ui';

export const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'deliveryman') return <Navigate to="/delivery" replace />;
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
