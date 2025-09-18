import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugAuth = () => {
  const { user, userProfile, loading, signOut, forceLogout } = useAuth();
  const [devMode, setDevMode] = useState(localStorage.getItem('dev-mode') === 'true');

  const toggleDevMode = () => {
    const newMode = !devMode;
    setDevMode(newMode);
    localStorage.setItem('dev-mode', newMode.toString());
    
    if (newMode) {
      console.log('Development mode enabled - sessions will be cleared on refresh');
    } else {
      console.log('Development mode disabled - sessions will persist');
    }
  };

  const styles = {
    debugPanel: {
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: '#eebbc3',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      border: '1px solid #eebbc3'
    },
    button: {
      background: '#eebbc3',
      color: '#232946',
      border: 'none',
      padding: '5px 10px',
      margin: '2px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '10px'
    },
    devButton: {
      background: devMode ? '#4ade80' : '#6b7280',
      color: '#ffffff',
      border: 'none',
      padding: '5px 10px',
      margin: '2px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '10px'
    },
    status: {
      marginBottom: '10px',
      fontFamily: 'monospace',
      fontSize: '10px'
    },
    title: {
      margin: '0 0 10px 0', 
      color: '#eebbc3',
      fontSize: '13px'
    }
  };

  return (
    <div style={styles.debugPanel}>
      <h4 style={styles.title}>Auth Debug Panel</h4>
      
      <div style={styles.status}>
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {user ? user.email : 'None'}</div>
        <div><strong>Profile:</strong> {userProfile ? 'Loaded' : 'None'}</div>
        <div><strong>Dev Mode:</strong> {devMode ? 'ON' : 'OFF'}</div>
      </div>

      <div>
        <button style={styles.devButton} onClick={toggleDevMode}>
          {devMode ? 'Disable Dev Mode' : 'Enable Dev Mode'}
        </button>
        <br />
        <button style={styles.button} onClick={signOut}>
          Normal Logout
        </button>
        <button style={styles.button} onClick={forceLogout}>
          Force Logout
        </button>
        <button 
          style={styles.button} 
          onClick={() => {
            console.log('Auth State:', { user, userProfile, loading });
            console.log('LocalStorage keys:', Object.keys(localStorage));
            console.log('SessionStorage keys:', Object.keys(sessionStorage));
          }}
        >
          Log State
        </button>
      </div>
    </div>
  );
};

export default DebugAuth;