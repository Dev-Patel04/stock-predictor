import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear any persistent sessions on app startup (for development/testing)
    const clearSessionOnStartup = () => {
      const sessionCleared = sessionStorage.getItem('auth-session-cleared');
      if (!sessionCleared) {
        console.log('Clearing persistent session on startup');
        localStorage.clear();
        sessionStorage.setItem('auth-session-cleared', 'true');
      }
    };

    // Clear session on startup
    clearSessionOnStartup();

    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Auth initialization timeout, setting loading to false');
      setLoading(false);
    }, 10000); // 10 second timeout

    // Add session cleanup on page unload (temporary workaround)
    const handleBeforeUnload = () => {
      // Clear any local storage sessions (optional - for testing)
      localStorage.removeItem('supabase.auth.token');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Get initial session
    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      // Clear the timeout since we got a response
      clearTimeout(timeout);
      
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      subscription.unsubscribe();
    };
  }, []);

  const getInitialSession = async () => {
    try {
      console.log('Getting initial session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('Session data:', session);
      console.log('Session error:', error);
      
      if (error) {
        console.error('Error getting session:', error);
        return;
      }

      if (session?.user) {
        console.log('User found in session:', session.user.email);
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      } else {
        console.log('No user in session');
      }
    } catch (error) {
      console.error('Error in getInitialSession:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching profile:', error);
        // Don't create profile automatically if there's a permission error
        return;
      }

      if (data) {
        setUserProfile(data);
      } else {
        // Profile doesn't exist, create one
        console.log('No profile found, creating new profile for user:', userId);
        await createUserProfile(userId);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const createUserProfile = async (userId) => {
    try {
      console.log('Creating profile for user:', userId);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        console.error('No user data available for profile creation');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: userData.user.email,
            full_name: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        // If profile creation fails, user can still use the app
        // Just log the error and continue
        return;
      }

      console.log('Profile created successfully:', data);
      setUserProfile(data);
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      // Don't block the user if profile creation fails
    }
  };

  const signUp = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out user...');
      
      // Force clear local storage
      localStorage.removeItem('supabase.auth.token');
      localStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
      }
      
      // Force clear state regardless of Supabase response
      setUser(null);
      setUserProfile(null);
      
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error in signOut:', error);
      // Force clear state even if there's an error
      setUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Force logout function for debugging
  const forceLogout = () => {
    console.log('Force logout triggered');
    localStorage.clear();
    setUser(null);
    setUserProfile(null);
    setLoading(false);
    window.location.reload();
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setUserProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { data: null, error };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { error };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    forceLogout,
    updateProfile,
    resetPassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;