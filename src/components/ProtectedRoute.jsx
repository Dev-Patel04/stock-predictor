import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, fallback = null }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return fallback || <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <div className="auth-required-content">
          <h2>🔐 Authentication Required</h2>
          <p>Please log in to access this feature.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="auth-required-btn"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;