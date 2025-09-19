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
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let authTimeout;

    const initializeAuth = async () => {
      try {
        console.log('🔍 Initializing authentication...');
        
        // Set a maximum timeout for auth initialization
        authTimeout = setTimeout(() => {
          if (mounted) {
            console.warn('⏰ Auth initialization timeout - proceeding without auth');
            setAuthError('Authentication timeout - using guest mode');
            setLoading(false);
          }
        }, 3000); // 3 second timeout

        // Try to get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          clearTimeout(authTimeout);
          
          if (error) {
            console.warn('Auth session error:', error.message);
            setAuthError(error.message);
            setUser(null);
          } else if (session?.user) {
            console.log('✅ User session found:', session.user.email);
            setUser(session.user);
            // Try to fetch profile, but don't block if it fails
            fetchUserProfile(session.user.id).catch(err => {
              console.warn('Profile fetch failed:', err.message);
            });
          } else {
            console.log('👤 No active session');
            setUser(null);
          }
          
          setLoading(false);
        }

      } catch (error) {
        console.error('🚨 Auth initialization failed:', error);
        if (mounted) {
          clearTimeout(authTimeout);
          setAuthError(error.message);
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Listen for auth state changes (but don't block on this)
    let subscription;
    try {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (mounted) {
            console.log('🔄 Auth state changed:', event, session?.user?.email);
            if (session?.user) {
              setUser(session.user);
              setAuthError(null);
              // Try to fetch profile asynchronously, don't block
              setTimeout(() => {
                fetchUserProfile(session.user.id).catch(err => {
                  console.warn('Profile fetch failed (non-blocking):', err.message);
                });
              }, 100);
            } else {
              setUser(null);
            }
            setLoading(false);
          }
        }
      );
      subscription = authSubscription;
    } catch (error) {
      console.warn('Auth state listener failed:', error.message);
    }

    // Start auth initialization
    initializeAuth();

    // Cleanup
    return () => {
      mounted = false;
      if (authTimeout) clearTimeout(authTimeout);
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.warn('Subscription cleanup failed:', error.message);
        }
      }
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      console.log('👤 Attempting to fetch profile for:', userId);
      const { data, error } = await supabase
        .from('Profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, try to create one
          console.log('📝 Profile not found, creating new profile');
          await createUserProfile(userId);
        } else {
          console.warn('Profile fetch error:', error.message);
        }
        return;
      }

      if (data) {
        console.log('✅ Profile found:', data);
        setUserProfile(data);
        // Don't try to create profile if we already found one
        return;
      }
    } catch (error) {
      console.warn('Profile operations failed:', error.message);
      // Don't block auth if profile operations fail
    }
  };

  const createUserProfile = async (userId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('Profiles')
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

      if (error) throw error;
      console.log('✅ Profile created:', data);
      setUserProfile(data);
    } catch (error) {
      console.warn('Profile creation failed:', error.message);
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
      console.error('SignUp error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('🔐 Starting signIn for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('🔐 SignIn response:', { data: data?.user?.email, error: error?.message });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('🚨 SignIn error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setAuthError(null);
    } catch (error) {
      console.error('SignOut error:', error);
      // Force logout even if Supabase fails
      setUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error };
    }
  };

  const forceLogout = () => {
    localStorage.clear();
    setUser(null);
    setUserProfile(null);
    setAuthError(null);
    setLoading(false);
    window.location.reload();
  };

  const value = {
    user,
    userProfile,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    resetPassword,
    forceLogout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;