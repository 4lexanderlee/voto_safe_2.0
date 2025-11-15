// src/utils/authStorage.ts

import type { User } from '@/types/auth.types';

const USERS_KEY = 'votosafe_users';
const CURRENT_USER_KEY = 'votosafe_current_user';

export const authStorageUtils = {
  // Obtener todos los usuarios
  getUsers: (): User[] => {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer usuarios:', error);
      return [];
    }
  },

  // Guardar usuarios
  saveUsers: (users: User[]): void => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error al guardar usuarios:', error);
    }
  },

  // Registrar nuevo usuario
  register: (user: Omit<User, 'createdAt'>): { success: boolean; message: string } => {
    const users = authStorageUtils.getUsers();
    
    // Verificar si el DNI ya existe
    if (users.some((u) => u.id === user.id)) {
      return { success: false, message: 'El DNI ya está registrado' };
    }

    // Verificar si el email ya existe
    if (users.some((u) => u.email === user.email)) {
      return { success: false, message: 'El email ya está registrado' };
    }

    const newUser: User = {
      ...user,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    authStorageUtils.saveUsers(users);
    return { success: true, message: 'Usuario registrado exitosamente' };
  },

  // Login
  login: (dni: string, password: string): { success: boolean; user?: User; message: string } => {
    const users = authStorageUtils.getUsers();
    const user = users.find((u) => u.id === dni && u.password === password);

    if (!user) {
      return { success: false, message: 'DNI o contraseña incorrectos' };
    }

    // Guardar usuario actual
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, user, message: 'Login exitoso' };
  },

  // Obtener usuario actual
  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al leer usuario actual:', error);
      return null;
    }
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Verificar si hay sesión activa
  isAuthenticated: (): boolean => {
    return authStorageUtils.getCurrentUser() !== null;
  },

  // Verificar si es admin
  isAdmin: (): boolean => {
    const user = authStorageUtils.getCurrentUser();
    return user?.role === 'admin';
  },

  // Inicializar usuario admin por defecto
  initializeAdmin: (): void => {
    const users = authStorageUtils.getUsers();
    const adminExists = users.some((u) => u.id === '72381395');

    if (!adminExists) {
      const admin: User = {
        id: '72381395',
        fullName: 'Admin Usuario',
        email: 'admin@votosafe.com',
        password: 'admin123', // En producción sería hasheado
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      users.push(admin);
      authStorageUtils.saveUsers(users);
    }
  },
};