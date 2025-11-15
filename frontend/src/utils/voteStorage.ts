// src/utils/voteStorage.ts

import type { UserVote, VoteStatus } from '@/types/vote.types';
import type { Election } from '@/types/election.types';
import { partyStorageUtils } from './partyStorage';

const STORAGE_KEY = 'votosafe_votes';

export const voteStorageUtils = {
  // Obtener todos los votos
  getVotes: (): UserVote[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer votos:', error);
      return [];
    }
  },

  // Guardar todos los votos
  saveVotes: (votes: UserVote[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    } catch (error) {
      console.error('Error al guardar votos:', error);
    }
  },

  // Obtener votos de un usuario
  getVotesByUser: (userId: string): UserVote[] => {
    const votes = voteStorageUtils.getVotes();
    return votes.filter((vote) => vote.userId === userId);
  },

  // Obtener votos de una elección
  getVotesByElection: (electionId: string): UserVote[] => {
    const votes = voteStorageUtils.getVotes();
    return votes.filter((vote) => vote.electionId === electionId);
  },

  // Obtener voto específico de usuario en elección
  getUserVoteForElection: (userId: string, electionId: string): UserVote | undefined => {
    const votes = voteStorageUtils.getVotes();
    // Si permite múltiples votos, devolver el más reciente
    const userVotes = votes.filter(
      (vote) => vote.userId === userId && vote.electionId === electionId
    );
    return userVotes.length > 0 ? userVotes[userVotes.length - 1] : undefined;
  },

  // Registrar nuevo voto
  addVote: (vote: UserVote): void => {
    const votes = voteStorageUtils.getVotes();
    votes.push(vote);
    voteStorageUtils.saveVotes(votes);
  },

  // Verificar si usuario ya votó en elección
  hasUserVoted: (userId: string, electionId: string): boolean => {
    const vote = voteStorageUtils.getUserVoteForElection(userId, electionId);
    return vote !== undefined;
  },

  // Calcular estado de cédula para un usuario
  getBallotStatus: (userId: string, election: Election): VoteStatus => {
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    // Verificar si hay partidos válidos (al menos 1 partido con todas las categorías)
    const parties = partyStorageUtils.getPartiesByElection(election.id);
    const validParty = parties.find((party) => {
      const requiredCategoryIds = election.categories.map((c) => c.id);
      const validation = partyStorageUtils.validatePartyCandidates(party, requiredCategoryIds);
      return validation.isValid;
    });

    if (!validParty) {
      return 'PENDIENTE';
    }

    // Si aún no ha comenzado la elección
    if (now < startDate) {
      return 'PENDIENTE';
    }

    // Si ya terminó la elección
    if (now > endDate) {
      const userVote = voteStorageUtils.getUserVoteForElection(userId, election.id);
      if (!userVote) {
        return 'NO VOTO';
      }
      return userVote.status;
    }

    // Si está en período de votación
    const userVote = voteStorageUtils.getUserVoteForElection(userId, election.id);
    if (!userVote) {
      return 'ACTIVA';
    }

    return userVote.status;
  },

  // Determinar si puede votar
  canUserVote: (userId: string, election: Election): boolean => {
    const status = voteStorageUtils.getBallotStatus(userId, election);
    
    // Si la elección permite votos múltiples y está activa
    if (election.allowMultipleVotes && status !== 'PENDIENTE' && status !== 'NO VOTO') {
      const now = new Date();
      const endDate = new Date(election.endDate);
      return now <= endDate;
    }

    // Solo puede votar si está ACTIVA
    return status === 'ACTIVA';
  },
};