
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  console.log('ProtectedRoute is now disabled, allowing all access');
  
  // With login disabled, we're allowing all access
  // No authentication or role checks are being performed
  return <Outlet />;
};

export default ProtectedRoute;
