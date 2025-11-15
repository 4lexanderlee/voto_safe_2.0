// src/hooks/useVoting.ts

import { useState } from 'react';
import type { Election } from '@/types/election.types';
import type { Party } from '@/types/party.types';
import type { UserVote, Vote } from '@/types/vote.types';
import { voteStorageUtils } from '@/utils/voteStorage';
import { partyStorageUtils } from '@/utils/partyStorage';

export const useVoting = (election: Election, userId: string) => {
  // Estado actual: categoría seleccionada
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  
  // Selecciones del usuario: { categoryId: partyId }
  const [selections, setSelections] = useState<Record<string, string>>({});

  // Obtener partidos de la elección
  const parties = partyStorageUtils.getPartiesByElection(election.id);

  // Categoría actual
  const currentCategory = election.categories[currentCategoryIndex];

  // Candidatos de la categoría actual
  const getCandidatesForCurrentCategory = () => {
    return parties
      .map((party) => {
        const candidate = party.candidates.find(
          (c) => c.categoryId === currentCategory.id
        );
        return candidate ? { party, candidate } : null;
      })
      .filter((item) => item !== null) as Array<{ party: Party; candidate: any }>;
  };

  // Seleccionar candidato
  const selectCandidate = (partyId: string) => {
    setSelections((prev) => ({
      ...prev,
      [currentCategory.id]: partyId,
    }));
  };

  // Navegar entre categorías
  const goToNextCategory = () => {
    if (currentCategoryIndex < election.categories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
    }
  };

  const goToPreviousCategory = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
    }
  };

  // Validar si puede enviar el voto
  const canSubmitVote = (): { valid: boolean; message: string } => {
    // Si permite voto nulo, siempre puede enviar
    if (election.allowNullVote) {
      return { valid: true, message: '' };
    }

    // Si requiere mínimo una categoría
    if (election.requireMinimumCategory && Object.keys(selections).length === 0) {
      return { valid: false, message: 'Debes seleccionar al menos una categoría' };
    }

    return { valid: true, message: '' };
  };

  // Enviar voto
  const submitVote = (): { success: boolean; message: string } => {
    const validation = canSubmitVote();
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    // Crear votos
    const votes: Vote[] = Object.entries(selections).map(([categoryId, partyId]) => {
      const party = parties.find((p) => p.id === partyId);
      const candidate = party?.candidates.find((c) => c.categoryId === categoryId);
      const category = election.categories.find((c) => c.id === categoryId);

      return {
        categoryId,
        categoryName: category?.name || '',
        partyId,
        partyName: party?.name || '',
        candidateId: candidate?.id || '',
        candidateName: `${candidate?.firstName} ${candidate?.lastName}` || '',
      };
    });

    // Determinar estado del voto
    const voteStatus = votes.length === 0 ? 'NULO' : 'VOTO';

    // Crear UserVote
    const userVote: UserVote = {
      id: crypto.randomUUID(),
      userId,
      electionId: election.id,
      electionName: election.name,
      votes,
      status: voteStatus,
      votedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Guardar voto
    voteStorageUtils.addVote(userVote);

    return { success: true, message: 'Voto enviado exitosamente' };
  };

  // Resetear selecciones
  const resetSelections = () => {
    setSelections({});
    setCurrentCategoryIndex(0);
  };

  return {
    currentCategory,
    currentCategoryIndex,
    totalCategories: election.categories.length,
    selections,
    candidates: getCandidatesForCurrentCategory(),
    selectCandidate,
    goToNextCategory,
    goToPreviousCategory,
    canGoNext: currentCategoryIndex < election.categories.length - 1,
    canGoPrevious: currentCategoryIndex > 0,
    isLastCategory: currentCategoryIndex === election.categories.length - 1,
    submitVote,
    canSubmitVote,
    resetSelections,
  };
};