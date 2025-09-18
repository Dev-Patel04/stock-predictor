import React from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './landing/LandingPage';
import SpaceBackground from './components/SpaceBackground';
import Tabs from './components/Tabs';
import Predictor from './components/Predictor';
import History from './components/History';
import News from './components/News';
import Settings from './components/Settings';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import DebugAuth from './components/DebugAuth';

// Main App Component (wrapped with AuthProvider)
function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner message="Initializing Stock Predictor..." />;
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Show main app if authenticated
  return (
    <>
      <SpaceBackground />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ProtectedRoute>
          <Tabs>
            {[
              <Predictor key="predictor" />, 
              <History key="history" />, 
              <News key="news" />, 
              <Settings key="settings" />
            ]}
          </Tabs>
        </ProtectedRoute>
      </div>
    </>
  );
}

// Root App Component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <DebugAuth />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
