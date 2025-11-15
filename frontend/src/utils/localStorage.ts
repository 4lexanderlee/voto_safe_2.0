//Helpers de localStorage
// src/utils/localStorage.ts

import type { Election } from '@/types/election.types';

const STORAGE_KEY = 'votosafe_elections';

export const localStorageUtils = {
  // Obtener todas las elecciones
  getElections: (): Election[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer elecciones:', error);
      return [];
    }
  },

  // Guardar todas las elecciones
  saveElections: (elections: Election[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(elections));
    } catch (error) {
      console.error('Error al guardar elecciones:', error);
    }
  },

  // Agregar nueva elección
  addElection: (election: Election): void => {
    const elections = localStorageUtils.getElections();
    elections.push(election);
    localStorageUtils.saveElections(elections);
  },

  // Actualizar elección existente
  updateElection: (id: string, updatedElection: Election): void => {
    const elections = localStorageUtils.getElections();
    const index = elections.findIndex((e) => e.id === id);
    if (index !== -1) {
      elections[index] = updatedElection;
      localStorageUtils.saveElections(elections);
    }
  },

  // Eliminar elección
  deleteElection: (id: string): void => {
    const elections = localStorageUtils.getElections();
    const filtered = elections.filter((e) => e.id !== id);
    localStorageUtils.saveElections(filtered);
  },

  // Obtener elección por ID
  getElectionById: (id: string): Election | undefined => {
    const elections = localStorageUtils.getElections();
    return elections.find((e) => e.id === id);
  },
};