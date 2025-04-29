
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is empty, any authenticated user can access
  if (allowedRoles.length === 0) {
    return <Outlet />;
  }

  // Check if user has required role
  const hasRequiredRole = user && allowedRoles.includes(user.role as UserRole);

  if (!hasRequiredRole) {
    // Redirect based on user role if they don't have access
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === 'staff') {
      return <Navigate to="/staff" replace />;
    } else {
      return <Navigate to="/member" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
