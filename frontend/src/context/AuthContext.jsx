import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('mizaniiti_user');
    const token      = localStorage.getItem('mizaniiti_token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    const { user, token } = response.data;

    localStorage.setItem('mizaniiti_token', token);
    localStorage.setItem('mizaniiti_user', JSON.stringify(user));
    setUser(user);

    return user;
  };

  const register = async (name, email, password, password_confirmation) => {
    const response = await api.post('/register', {
      name, email, password, password_confirmation,
    });
    const { user, token } = response.data;

    localStorage.setItem('mizaniiti_token', token);
    localStorage.setItem('mizaniiti_user', JSON.stringify(user));
    setUser(user);

    return user;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (_) {}
    localStorage.removeItem('mizaniiti_token');
    localStorage.removeItem('mizaniiti_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}