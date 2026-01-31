import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../ui/Loading';

const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  // Show loading while checking authentication
  if (isLoading) {
    return <Loading fullScreen text="Checking authentication..." />;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }
  
  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default ProtectedRoute;