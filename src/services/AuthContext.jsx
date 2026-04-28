import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    const savedToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('access_token');
    }

    setLoading(false);
  }, []);

  const login = (userData, token, rememberMe = false) => {
    setUser(userData);

    if (token) {
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('access_token', token);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('access_token');
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('access_token', token);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
