// src/types/vote.types.ts

export type VoteStatus = 'PENDIENTE' | 'ACTIVA' | 'VOTO' | 'NULO' | 'NO VOTO';

export interface Vote {
  categoryId: string;
  categoryName: string;
  partyId: string;
  partyName: string;
  candidateId: string;
  candidateName: string;
}

export interface UserVote {
  id: string;
  userId: string; // DNI del usuario
  electionId: string;
  electionName: string;
  votes: Vote[]; // Array de votos por categoría
  status: VoteStatus;
  votedAt: string; // Timestamp del voto
  createdAt: string;
}

export interface BallotStatus {
  electionId: string;
  status: VoteStatus;
  canVote: boolean; // Si puede votar ahora
  hasVoted: boolean; // Si ya votó
  allowMultipleVotes: boolean; // Si puede votar múltiples veces
}