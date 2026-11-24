import { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('aquasentinel_token');
    const stored = localStorage.getItem('aquasentinel_user');
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('aquasentinel_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('aquasentinel_token', token);
    localStorage.setItem('aquasentinel_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('aquasentinel_token');
    localStorage.removeItem('aquasentinel_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
