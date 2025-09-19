import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Settings.css';

export default function Settings() {
  const { user, userProfile, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('account');
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30,
    defaultChart: '1M',
    riskTolerance: 'moderate'
  });
  const [apiStatus, setApiStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  console.log('Settings component mounted');

  useEffect(() => {
    loadPreferences();
    checkAPIStatus();
  }, []);

  const loadPreferences = () => {
    try {
      const saved = localStorage.getItem('stock-predictor-preferences');
      if (saved) {
        setPreferences({ ...preferences, ...JSON.parse(saved) });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = () => {
    try {
      localStorage.setItem('stock-predictor-preferences', JSON.stringify(preferences));
      setMessage('Preferences saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Error saving preferences');
    }
  };

  const checkAPIStatus = async () => {
    setLoading(true);
    const status = {};
    
    // Check if API keys are configured
    const apiKeys = {
      polygon: import.meta.env.VITE_POLYGON_KEY,
      alphaVantage: import.meta.env.VITE_ALPHA_VANTAGE_KEY,
      news: import.meta.env.VITE_NEWS_API_KEY,
      gemini: import.meta.env.VITE_GOOGLE_GEMINI_KEY,
      huggingFace: import.meta.env.VITE_HUGGINGFACE_TOKEN
    };

    Object.entries(apiKeys).forEach(([key, value]) => {
      status[key] = {
        configured: !!value,
        status: value ? 'configured' : 'missing'
      };
    });

    setApiStatus(status);
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
      setMessage('Error logging out');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      localStorage.clear();
      sessionStorage.clear();
      setMessage('All local data cleared');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const exportData = () => {
    const data = {
      preferences,
      timestamp: new Date().toISOString(),
      user: user?.email
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-predictor-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setMessage('Data exported successfully');
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
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
          🎛️ Preferences
        </button>
        <button
          className={`settings-nav-item ${activeSection === 'api' ? 'active' : ''}`}
          onClick={() => setActiveSection('api')}
        >
          🔌 API Status
        </button>
        <button
          className={`settings-nav-item ${activeSection === 'data' ? 'active' : ''}`}
          onClick={() => setActiveSection('data')}
        >
          💾 Data Management
        </button>
      </div>

      {message && (
        <div className="message-banner">
          {message}
        </div>
      )}

      <div className="settings-content">
        {activeSection === 'account' && (
          <div className="settings-section">
            <h3>Account Information</h3>
            <div className="account-info">
              <div className="info-item">
                <label>Email</label>
                <span>{user?.email || 'Not available'}</span>
              </div>
              <div className="info-item">
                <label>User ID</label>
                <span>{user?.id || 'Not available'}</span>
              </div>
              <div className="info-item">
                <label>Account Created</label>
                <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'}</span>
              </div>
              <div className="info-item">
                <label>Profile Status</label>
                <span>{userProfile ? 'Loaded' : 'Not loaded'}</span>
              </div>
            </div>
            
            <div className="account-actions">
              <button 
                onClick={handleLogout} 
                className="logout-btn"
                disabled={loading}
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        )}

        {activeSection === 'preferences' && (
          <div className="settings-section">
            <h3>App Preferences</h3>
            
            <div className="preference-group">
              <h4>Display Settings</h4>
              <div className="preference-item">
                <label>Theme</label>
                <select 
                  value={preferences.theme} 
                  onChange={(e) => updatePreference('theme', e.target.value)}
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>

            <div className="preference-group">
              <h4>Data Settings</h4>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.autoRefresh}
                    onChange={(e) => updatePreference('autoRefresh', e.target.checked)}
                  />
                  Auto-refresh data
                </label>
              </div>
              <div className="preference-item">
                <label>Refresh interval (seconds)</label>
                <select 
                  value={preferences.refreshInterval} 
                  onChange={(e) => updatePreference('refreshInterval', parseInt(e.target.value))}
                  disabled={!preferences.autoRefresh}
                >
                  <option value={15}>15 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                </select>
              </div>
            </div>

            <div className="preference-group">
              <h4>Trading Settings</h4>
              <div className="preference-item">
                <label>Default chart timeframe</label>
                <select 
                  value={preferences.defaultChart} 
                  onChange={(e) => updatePreference('defaultChart', e.target.value)}
                >
                  <option value="1D">1 Day</option>
                  <option value="5D">5 Days</option>
                  <option value="1M">1 Month</option>
                  <option value="3M">3 Months</option>
                  <option value="6M">6 Months</option>
                  <option value="1Y">1 Year</option>
                </select>
              </div>
              <div className="preference-item">
                <label>Risk tolerance</label>
                <select 
                  value={preferences.riskTolerance} 
                  onChange={(e) => updatePreference('riskTolerance', e.target.value)}
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
            </div>

            <div className="preference-group">
              <h4>Notifications</h4>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) => updatePreference('notifications', e.target.checked)}
                  />
                  Enable notifications
                </label>
              </div>
            </div>

            <button onClick={savePreferences} className="save-btn">
              Save Preferences
            </button>
          </div>
        )}

        {activeSection === 'api' && (
          <div className="settings-section">
            <h3>API Configuration Status</h3>
            <div className="api-status-grid">
              {Object.entries(apiStatus).map(([key, status]) => (
                <div key={key} className={`api-status-card ${status.status}`}>
                  <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                  <div className={`status-indicator ${status.status}`}>
                    {status.configured ? '✅ Configured' : '❌ Missing'}
                  </div>
                  <p>
                    {status.configured 
                      ? 'API key is configured and ready to use' 
                      : 'API key needs to be added to .env file'}
                  </p>
                </div>
              ))}
            </div>
            <button onClick={checkAPIStatus} className="refresh-btn" disabled={loading}>
              {loading ? 'Checking...' : 'Refresh Status'}
            </button>
          </div>
        )}

        {activeSection === 'data' && (
          <div className="settings-section">
            <h3>Data Management</h3>
            
            <div className="data-actions">
              <div className="action-card">
                <h4>Export Data</h4>
                <p>Download your preferences and settings as a JSON file</p>
                <button onClick={exportData} className="export-btn">
                  Export Data
                </button>
              </div>
              
              <div className="action-card">
                <h4>Clear All Data</h4>
                <p>Remove all local data including preferences and cache</p>
                <button onClick={clearData} className="clear-btn">
                  Clear Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}