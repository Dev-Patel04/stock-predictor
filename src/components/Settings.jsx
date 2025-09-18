import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user, userProfile, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // The AuthContext will handle the redirect
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      <p>Configure your app preferences here.</p>
      
      {user && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Account</h3>
          <p>Welcome, {user.email || 'User'}!</p>
          {userProfile && (
            <div>
              <p>Profile ID: {userProfile.id}</p>
              <p>Created: {new Date(userProfile.created_at).toLocaleDateString()}</p>
            </div>
          )}
          <button 
            onClick={handleLogout}
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
