
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
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

  // If authenticated and has permission, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
