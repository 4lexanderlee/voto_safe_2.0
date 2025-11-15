//Hook para manejar partidos
// src/hooks/useParties.ts

import { useState, useEffect } from 'react';
import type { Party } from '@/types/party.types'; //DUP
//import type { Party, Candidate } from '@/types/party.types'; //DUP
//import type { Election } from '@/types/election.types';
import { partyStorageUtils } from '@/utils/partyStorage';
import { localStorageUtils } from '@/utils/localStorage';

export const useParties = (electionId?: string) => {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar partidos al montar o cuando cambia electionId
  useEffect(() => {
    loadParties();
  }, [electionId]);

  const loadParties = () => {
    setLoading(true);
    try {
      if (electionId) {
        const data = partyStorageUtils.getPartiesByElection(electionId);
        setParties(data);
      } else {
        const data = partyStorageUtils.getParties();
        setParties(data);
      }
    } catch (error) {
      console.error('Error al cargar partidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addParty = (party: Party) => {
    // Validar que no exista partido con mismo nombre en la elección
    if (partyStorageUtils.partyExistsInElection(party.electionId, party.name)) {
      throw new Error('Ya existe un partido con ese nombre en esta elección');
    }

    // Validar que tenga candidatos para todas las categorías
    const election = localStorageUtils.getElectionById(party.electionId);
    if (election) {
      const requiredCategoryIds = election.categories.map(c => c.id);
      const validation = partyStorageUtils.validatePartyCandidates(party, requiredCategoryIds);
      
      if (!validation.isValid) {
        throw new Error(`Faltan candidatos para las categorías: ${validation.missingCategories.join(', ')}`);
      }
    }

    partyStorageUtils.addParty(party);
    loadParties();
  };

  const updateParty = (id: string, party: Party) => {
    // Validar que no exista partido con mismo nombre (excluyendo el actual)
    if (partyStorageUtils.partyExistsInElection(party.electionId, party.name, id)) {
      throw new Error('Ya existe un partido con ese nombre en esta elección');
    }

    // Validar que tenga candidatos para todas las categorías
    const election = localStorageUtils.getElectionById(party.electionId);
    if (election) {
      const requiredCategoryIds = election.categories.map(c => c.id);
      const validation = partyStorageUtils.validatePartyCandidates(party, requiredCategoryIds);
      
      if (!validation.isValid) {
        throw new Error(`Faltan candidatos para las categorías: ${validation.missingCategories.join(', ')}`);
      }
    }

    partyStorageUtils.updateParty(id, party);
    loadParties();
  };

  const deleteParty = (id: string) => {
    partyStorageUtils.deleteParty(id);
    loadParties();
  };

  const addMultipleParties = (newParties: Party[]) => {
    partyStorageUtils.addMultipleParties(newParties);
    loadParties();
  };

  const getPartyById = (id: string): Party | undefined => {
    return partyStorageUtils.getPartyById(id);
  };

  return {
    parties,
    loading,
    addParty,
    updateParty,
    deleteParty,
    addMultipleParties,
    getPartyById,
    loadParties,
  };
};