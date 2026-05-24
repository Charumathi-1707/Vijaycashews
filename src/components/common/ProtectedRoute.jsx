import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ProtectedRoute = ({
  children,
  allowRoles,
  guestOnly = false,
  redirectTo = "/login",
}) => {
  const { user } = useAuth();
  const location = useLocation();

  if (guestOnly) {
    if (user) {
      return <Navigate to="/products" state={{ from: location }} replace />;
    }
    return children;
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowRoles && !allowRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
