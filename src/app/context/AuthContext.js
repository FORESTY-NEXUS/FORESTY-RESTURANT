'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }));
    setUser(data);
    
    // Redirect based on role
    if (data.role === 'admin') router.push('/admin');
    else if (data.role === 'delivery') router.push('/delivery');
    else router.push('/order');
  };

  const register = async (name, email, password, phone, role = 'customer') => {
    const { data } = await api.post('/auth/register', { name, email, password, phone, role });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    router.push('/order');
  };

  const loginWithGoogle = async (idToken) => {
    const { data } = await api.post('/auth/google', { idToken });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    if (data.role === 'admin') router.push('/admin');
    else if (data.role === 'delivery') router.push('/delivery');
    else router.push('/order');
  };

  const updateProfile = async (profileData) => {
    const { data } = await api.put('/auth/me', profileData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const forgotPassword = async (email) => {
    await api.post('/auth/forgot-password', { email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, updateProfile, forgotPassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
