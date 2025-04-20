
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute check:', { isAuthenticated, user, allowedRoles });

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role restrictions if specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.log('User does not have required role, redirecting based on role');
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

  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
