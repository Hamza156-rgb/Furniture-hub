import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [shop, setShop]     = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await getMe();
      setUser(data.user);
      setShop(data.shop || null);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = (token, userData, shopData = null) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setShop(shopData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShop(null);
  };

  return (
    <AuthContext.Provider value={{ user, shop, setShop, loading, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
