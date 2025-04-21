import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoadingScreen from './LoadingScreen';

// This component prevents authenticated users from accessing public routes
// like login, signup, and landing page
const PublicRouteGuard = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise, render the public route
  return children;
};

export default PublicRouteGuard;
