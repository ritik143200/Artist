import { createContext, useContext, useState, useEffect } from 'react';

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

  // Check for logged-in user on mount
  useEffect(() => {
    // Check localStorage for user data
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('🔑 User loaded from localStorage:', userData);
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        localStorage.removeItem('loggedInUser');
      }
    }
    setLoading(false);
  }, []);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('loggedInUser');
    }
  }, [user]);

  // Login function
  const login = (userData) => {
    setUser(userData);
    console.log('✅ User logged in:', userData);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    console.log('🚪 User logged out');
  };

  // Update user function
  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
    console.log('📝 User updated:', userData);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
