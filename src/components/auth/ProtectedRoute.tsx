import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/database';

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
    switch (user?.role) {
      case 'admin':
        return <Navigate to="/admin-landing" replace />;
      case 'staff':
        return <Navigate to="/staff-landing" replace />;
      case 'member':
        return <Navigate to="/member-landing" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
