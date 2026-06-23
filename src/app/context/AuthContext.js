'use client';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }));
    setUser(data);
    
    // Redirect based on role
    if (data.role === 'admin') router.push('/admin');
    else if (data.role === 'delivery') router.push('/delivery');
    else {
      toast.success('Logged in successfully!');
      router.push('/');
    }
  }, [router, toast]);

  const register = useCallback(async (name, email, password, phone, role = 'customer') => {
    const { data } = await api.post('/auth/register', { name, email, password, phone, role });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    toast.success('Account created successfully!');
    router.push('/');
  }, [router, toast]);

  const updateProfile = useCallback(async (profileData) => {
    const { data } = await api.put('/auth/me', profileData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    toast.success('Profile updated successfully!');
    return data;
  }, [toast]);

  const forgotPassword = useCallback(async (email) => {
    await api.post('/auth/forgot-password', { email });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Logged out successfully');
    router.push('/');
  }, [router, toast]);

  const value = useMemo(() => ({
    user, login, register, updateProfile, forgotPassword, logout, loading
  }), [user, login, register, updateProfile, forgotPassword, logout, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
