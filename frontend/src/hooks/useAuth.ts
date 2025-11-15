// src/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import type { User, AuthState } from '@/types/auth.types';
import { authStorageUtils } from '@/utils/authStorage';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Inicializar admin por defecto
    authStorageUtils.initializeAdmin();
    
    // Cargar usuario actual
    const currentUser = authStorageUtils.getCurrentUser();
    if (currentUser) {
      setAuthState({
        user: currentUser,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = (dni: string, password: string): { success: boolean; message: string } => {
    const result = authStorageUtils.login(dni, password);
    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
      });
    }
    return result;
  };

  const register = (userData: Omit<User, 'createdAt'>): { success: boolean; message: string } => {
    return authStorageUtils.register(userData);
  };

  const logout = (): void => {
    authStorageUtils.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
  };

  const isAdmin = (): boolean => {
    return authState.user?.role === 'admin';
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    login,
    register,
    logout,
    isAdmin,
  };
};