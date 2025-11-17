// src/types/dashboard.types.ts
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