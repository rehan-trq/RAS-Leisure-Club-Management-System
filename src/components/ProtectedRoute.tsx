
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  // Only check if user has required role
  if (user && !allowedRoles.includes(user.role)) {
    // Redirect based on user role if accessing unauthorized route
    switch (user.role) {
      case 'member':
        return <Navigate to="/member" replace />;
      case 'staff':
        return <Navigate to="/staff" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // If no role restrictions or has permission, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
