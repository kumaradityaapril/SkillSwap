import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

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
  const [sessionBookedFlag, setSessionBookedFlag] = useState(false); // Add state for session booking flag

  // Function to load user from token
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        console.log('loadUser: Fetching user data from https://skillswap-3-ko34.onrender.com/api/users/me');
        const res = await axios.get('https://skillswap-3-ko34.onrender.com/api/users/me');
        console.log('loadUser: Received user data', res.data.data);
        setUser(res.data.data); // Assuming user data is in res.data.data
      } catch (err) {
        console.error('loadUser: Error fetching user:', err);
        localStorage.removeItem('token'); // Remove invalid token
        setUser(null);
        setError('Failed to load user.');
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  // Load user on component mount
  useEffect(() => {
    console.log('AuthProvider useEffect: Attempting to load user');
    loadUser();
  }, []); // Empty dependency array means this runs only on mount

  // Function to be called after successful login/signup
  const handleAuthSuccess = async (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('handleAuthSuccess: Token set, loading user...');
    await loadUser(); // Load user data immediately after setting token
  };

  const signOut = () => {
    console.log('signOut: Signing out user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
    console.log('signOut: User signed out');
  };

  const clearError = () => {
    setError(null);
  };

  // Function to trigger the session booked flag
  const triggerSessionBookedFlag = () => {
    console.log('Triggering session booked flag');
    setSessionBookedFlag(prev => !prev);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    handleAuthSuccess, // Expose this function
    signOut,
    clearError,
    sessionBookedFlag, // Expose the flag
    triggerSessionBookedFlag, // Expose the trigger function
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;