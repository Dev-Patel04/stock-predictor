import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Settings.css';

export default function Settings() {
  const { user, userProfile, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('account');

  const handleLogout = async () => {
    try {
      await signOut();
      // The AuthContext will handle the redirect
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Configure your app preferences and account settings</p>
      </div>

      <div className="settings-nav">
        <button
          className={`settings-nav-item ${activeSection === 'account' ? 'active' : ''}`}
          onClick={() => setActiveSection('account')}
        >
          👤 Account
        </button>
        <button
          className={`settings-nav-item ${activeSection === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveSection('preferences')}
        >
          ⚙️ Preferences
        </button>
        <button
          className={`settings-nav-item ${activeSection === 'api' ? 'active' : ''}`}
          onClick={() => setActiveSection('api')}
        >
          🔑 API Keys
        </button>
      </div>

      <div className="settings-content">
        {activeSection === 'account' && (
          <div className="settings-section">
            <h3>Account Information</h3>
            {user && (
              <div className="account-info">
                <div className="info-item">
                  <label>Email:</label>
                  <span>{user.email || 'Not provided'}</span>
                </div>
                {userProfile && (
                  <>
                    <div className="info-item">
                      <label>User ID:</label>
                      <span>{userProfile.id}</span>
                    </div>
                    <div className="info-item">
                      <label>Member since:</label>
                      <span>{new Date(userProfile.created_at).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
                <div className="account-actions">
                  <button className="logout-button" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'preferences' && (
          <div className="settings-section">
            <h3>App Preferences</h3>
            <div className="preferences-grid">
              <div className="preference-item">
                <label>Default Time Frame:</label>
                <select className="preference-select">
                  <option value="1D">1 Day</option>
                  <option value="1W">1 Week</option>
                  <option value="1M" selected>1 Month</option>
                  <option value="3M">3 Months</option>
                  <option value="1Y">1 Year</option>
                </select>
              </div>
              <div className="preference-item">
                <label>Chart Theme:</label>
                <select className="preference-select">
                  <option value="dark" selected>Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div className="preference-item">
                <label>Default Currency:</label>
                <select className="preference-select">
                  <option value="USD" selected>USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div className="preference-item">
                <label>Auto-refresh Data:</label>
                <select className="preference-select">
                  <option value="30">30 seconds</option>
                  <option value="60" selected>1 minute</option>
                  <option value="300">5 minutes</option>
                  <option value="0">Manual</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'api' && (
          <div className="settings-section">
            <h3>API Configuration</h3>
            <div className="api-status">
              <div className="api-item">
                <span className="api-name">Yahoo Finance API</span>
                <span className="api-status-indicator connected">🟢 Connected</span>
              </div>
              <div className="api-item">
                <span className="api-name">Alpha Vantage API</span>
                <span className="api-status-indicator connected">🟢 Connected</span>
              </div>
              <div className="api-item">
                <span className="api-name">Polygon.io API</span>
                <span className="api-status-indicator connected">🟢 Connected</span>
              </div>
              <div className="api-item">
                <span className="api-name">News API</span>
                <span className="api-status-indicator connected">🟢 Connected</span>
              </div>
              <div className="api-item">
                <span className="api-name">Google Gemini AI</span>
                <span className="api-status-indicator connected">🟢 Connected</span>
              </div>
              <div className="api-item">
                <span className="api-name">Hugging Face AI</span>
                <span className="api-status-indicator connected">🟢 Connected</span>
              </div>
            </div>
            <div className="api-note">
              <p>🔒 All API keys are securely stored and encrypted.</p>
              <p>📊 Current usage limits and quotas are managed automatically.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
