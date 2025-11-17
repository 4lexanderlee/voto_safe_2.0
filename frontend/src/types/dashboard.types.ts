// src/types/dashboard.types.ts

// Define la estructura del usuario que genera tu script de prueba
export interface MockUser {
  DNI: string;
  Nombres: string;
  Apellidos: string;
  "Fecha Nac.": string;
  Tipo: 'admin' | 'user';
  Departamento: string;
  Estado: 'voto' | 'no voto';
  Elección: string;
}