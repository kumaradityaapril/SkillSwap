import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Google Sign-In
  useEffect(() => {
    const initializeGoogleAuth = async () => {
      try {
        // Load Google Identity Services script
        if (!window.google) {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
          
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Check if user is already logged in (from localStorage)
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error initializing Google Auth:', error);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeGoogleAuth();
  }, []);

  const handleGoogleResponse = (response) => {
    try {
      // Decode the JWT token
      const token = response.credential;
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const userData = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        token: token,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setError(null);
    } catch (error) {
      console.error('Error processing Google response:', error);
      setError('Failed to process authentication response');
    }
  };

  const signInWithGoogle = () => {
    try {
      if (window.google) {
        window.google.accounts.id.prompt();
      } else {
        setError('Google authentication not available');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google');
    }
  };

  const signOut = () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      if (window.google) {
        window.google.accounts.id.disableAutoSelect();
      }
      setError(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;