import React, { useState } from 'react';
import './App.css';
import LandingPage from './landing/LandingPage';
import SpaceBackground from './components/SpaceBackground';
import Tabs from './components/Tabs';
import Predictor from './components/Predictor';
import History from './components/History';
import News from './components/News';
import Settings from './components/Settings';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleAuthenticated = (authData) => {
    setIsAuthenticated(true);
    setUser(authData);
    console.log('User authenticated:', authData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return <LandingPage onAuthenticated={handleAuthenticated} />;
  }

  // Show main app if authenticated
  return (
    <>
      <SpaceBackground />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Tabs>
          {[
            <Predictor key="predictor" />, 
            <History key="history" />, 
            <News key="news" />, 
            <Settings key="settings" user={user} onLogout={handleLogout} />
          ]}
        </Tabs>
      </div>
    </>
  );
}

export default App;
