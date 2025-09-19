import React from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import SpaceBackground from './components/SpaceBackground';
import LandingPage from './landing/LandingPage';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <SpaceBackground />
        <LandingPage />
      </div>
    </AuthProvider>
  );
}

export default App;
