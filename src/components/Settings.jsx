import React from 'react';

export default function Settings({ user, onLogout }) {
  return (
    <div>
      <h2>Settings</h2>
      <p>Configure your app preferences here.</p>
      
      {user && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Account</h3>
          <p>Welcome, {user.data?.email || 'User'}!</p>
          <button 
            onClick={onLogout}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#ff6b6b', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
