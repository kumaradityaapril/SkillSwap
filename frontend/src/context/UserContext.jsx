import { createContext, useState, useContext, useEffect } from 'react';

// Create a context for user management
const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// User provider component
export const UserProvider = ({ children }) => {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Initialize active role state
  const [activeRole, setActiveRole] = useState(() => {
    if (!user) return 'both';
    return localStorage.getItem('activeRole') || user.role || 'both';
  });

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Update localStorage when active role changes
  useEffect(() => {
    localStorage.setItem('activeRole', activeRole);
  }, [activeRole]);

  // Login function
  const login = (userData) => {
    setUser(userData);
    setActiveRole(userData.role || 'both');
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setActiveRole('both');
    localStorage.removeItem('token');
  };

  // Update user function
  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // Change active role function
  const changeRole = (newRole) => {
    if (['learner', 'mentor', 'both'].includes(newRole)) {
      setActiveRole(newRole);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has all roles
    if (user.role === 'both') return true; // 'both' has both learner and mentor roles
    return user.role === role;
  };

  // Provide user context to children
  return (
    <UserContext.Provider value={{
      user,
      activeRole,
      login,
      logout,
      updateUser,
      changeRole,
      isAuthenticated,
      hasRole,
    }}>
      {children}
    </UserContext.Provider>
  );
};