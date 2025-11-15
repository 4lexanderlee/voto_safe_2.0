// src/types/auth.types.ts

export type UserRole = 'admin' | 'user';

export interface User {
  id: string; // DNI
  fullName: string;
  email: string;
  password: string; // En producción sería hasheado
  role: UserRole;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}