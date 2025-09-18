import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './landing/LandingPage';
import SpaceBackground from './components/SpaceBackground';
import Tabs from './components/Tabs';
import Dashboard from './components/Dashboard';
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
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStock, setSelectedStock] = useState('AAPL');

  const handleStockSelect = (symbol) => {
    setSelectedStock(symbol);
  };

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };

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
          <Tabs activeTab={activeTab} onTabChange={handleTabChange}>
            {[
              <Dashboard key="dashboard" onStockSelect={handleStockSelect} onTabChange={handleTabChange} />,
              <Predictor key="predictor" initialSymbol={selectedStock} />, 
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
