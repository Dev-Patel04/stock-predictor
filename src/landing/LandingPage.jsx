import React, { useState } from 'react';
import SpaceBackground from '../components/SpaceBackground';
import Login from './components/Login';
import SignUp from './components/SignUp';
import TermsModal from './components/TermsModal';
import './LandingPage.css';

export default function LandingPage() {
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'login', 'signup'
  const [showTerms, setShowTerms] = useState(false);

  const handleShowTerms = () => {
    setShowTerms(true);
  };

  const handleCloseTerms = () => {
    setShowTerms(false);
  };

  const handleAcceptTerms = () => {
    setShowTerms(false);
    // The checkbox in signup form will be handled separately
  };

  const renderWelcomeView = () => (
    <div className="welcome-container">
      <div className="top-nav">
        <div className="nav-auth-buttons">
          <button 
            className="nav-secondary-btn"
            onClick={() => setCurrentView('login')}
          >
            Sign In
          </button>
          <button 
            className="nav-primary-btn"
            onClick={() => setCurrentView('signup')}
          >
            Get Started
          </button>
        </div>
      </div>
      
      <div className="hero-section">
        <div className="logo-section">
          <div className="logo-placeholder">
            <div className="logo-icon">📊</div>
          </div>
          <h1 className="main-title">Stock Predictor</h1>
          <p className="subtitle">Predict the future of financial markets with AI-powered insights</p>
        </div>
        
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>AI-Powered Analysis</h3>
            <p>Advanced machine learning algorithms analyze market trends and patterns</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Real-Time Predictions</h3>
            <p>Get instant stock predictions based on current market conditions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Accurate Forecasts</h3>
            <p>Our models are trained on years of historical data for precision</p>
          </div>
        </div>
        
        <div className="cta-section">
          <h2>Ready to start predicting?</h2>
          <p className="auth-subtitle">
            Join thousands of traders making smarter investment decisions
          </p>
        </div>
      </div>
      
      <div className="floating-elements">
        <div className="floating-card card-1">
          <div className="mini-chart">
            <div className="chart-line"></div>
          </div>
          <span>+24.5%</span>
        </div>
        <div className="floating-card card-2">
          <div className="mini-chart">
            <div className="chart-line trend-down"></div>
          </div>
          <span>-8.2%</span>
        </div>
        <div className="floating-card card-3">
          <div className="prediction-badge">AI</div>
          <span>Prediction Ready</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="landing-page">
      <SpaceBackground />
      
      <div className="landing-content">
        {currentView === 'welcome' && renderWelcomeView()}
        
        {currentView === 'login' && (
          <div className="auth-container">
            <Login 
              onSwitch={setCurrentView}
            />
          </div>
        )}
        
        {currentView === 'signup' && (
          <div className="auth-container">
            <SignUp 
              onSwitch={setCurrentView}
              onShowTerms={handleShowTerms}
            />
          </div>
        )}
      </div>
      
      <TermsModal 
        isOpen={showTerms}
        onClose={handleCloseTerms}
        onAccept={handleAcceptTerms}
      />
    </div>
  );
}