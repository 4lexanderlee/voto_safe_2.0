//CRUD localStorage para partidos
// src/utils/partyStorage.ts

import type { Party } from '@/types/party.types';

const STORAGE_KEY = 'votosafe_parties';

export const partyStorageUtils = {
  // Obtener todos los partidos
  getParties: (): Party[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer partidos:', error);
      return [];
    }
  },

  // Guardar todos los partidos
  saveParties: (parties: Party[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parties));
    } catch (error) {
      console.error('Error al guardar partidos:', error);
    }
  },

  // Obtener partidos por ID de elección
  getPartiesByElection: (electionId: string): Party[] => {
    const parties = partyStorageUtils.getParties();
    return parties.filter((party) => party.electionId === electionId);
  },

  // Agregar nuevo partido
  addParty: (party: Party): void => {
    const parties = partyStorageUtils.getParties();
    parties.push(party);
    partyStorageUtils.saveParties(parties);
  },

  // Actualizar partido existente
  updateParty: (id: string, updatedParty: Party): void => {
    const parties = partyStorageUtils.getParties();
    const index = parties.findIndex((p) => p.id === id);
    if (index !== -1) {
      parties[index] = updatedParty;
      partyStorageUtils.saveParties(parties);
    }
  },

  // Eliminar partido
  deleteParty: (id: string): void => {
    const parties = partyStorageUtils.getParties();
    const filtered = parties.filter((p) => p.id !== id);
    partyStorageUtils.saveParties(filtered);
  },

  // Obtener partido por ID
  getPartyById: (id: string): Party | undefined => {
    const parties = partyStorageUtils.getParties();
    return parties.find((p) => p.id === id);
  },

  // Verificar si existe un partido con el mismo nombre en una elección
  partyExistsInElection: (electionId: string, partyName: string, excludeId?: string): boolean => {
    const parties = partyStorageUtils.getPartiesByElection(electionId);
    return parties.some(
      (p) => 
        p.name.toLowerCase() === partyName.toLowerCase() && 
        p.id !== excludeId
    );
  },

  // Agregar múltiples partidos (útil para importación CSV)
  addMultipleParties: (parties: Party[]): void => {
    const existingParties = partyStorageUtils.getParties();
    const allParties = [...existingParties, ...parties];
    partyStorageUtils.saveParties(allParties);
  },

  // Contar partidos de una elección
  countPartiesByElection: (electionId: string): number => {
    const parties = partyStorageUtils.getPartiesByElection(electionId);
    return parties.length;
  },

  // Eliminar todos los partidos de una elección (útil si se elimina una elección)
  deletePartiesByElection: (electionId: string): void => {
    const parties = partyStorageUtils.getParties();
    const filtered = parties.filter((p) => p.electionId !== electionId);
    partyStorageUtils.saveParties(filtered);
  },

  // Validar que un partido tenga candidatos para todas las categorías requeridas
  validatePartyCandidates: (party: Party, requiredCategoryIds: string[]): {
    isValid: boolean;
    missingCategories: string[];
  } => {
    const candidateCategoryIds = party.candidates.map((c) => c.categoryId);
    const missingCategories = requiredCategoryIds.filter(
      (catId) => !candidateCategoryIds.includes(catId)
    );

    return {
      isValid: missingCategories.length === 0,
      missingCategories,
    };
  },
};