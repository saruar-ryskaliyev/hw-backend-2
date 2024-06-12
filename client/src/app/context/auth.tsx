// src/context/auth.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

interface AuthContextProps {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://hw-backend-2-1.onrender.com/api/v1/auth/me')
        .then(response => {
          setUser(response.data);
          setLoading(false);
        })
        .catch((error: unknown) => {
          if (error instanceof AxiosError) {
            console.error('Failed to validate token:', error.response?.data);
          } else {
            console.error('Failed to validate token:', error);
          }
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://hw-backend-2-1.onrender.com/api/v1/auth/login', { email, password });
      localStorage.setItem('token', response.data.accessToken);
      setUser(response.data.user);
      router.push('/messenger');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Login failed:', error.response?.data);
      } else {
        console.error('Login failed:', error);
      }
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await axios.post('http://hw-backend-2-1.onrender.com/api/v1/auth/register', { username, email, password });
      router.push('/login');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Registration failed:', error.response?.data);
      } else {
        console.error('Registration failed:', error);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
