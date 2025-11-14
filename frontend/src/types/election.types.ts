//Interfaces TypeScript
// src/types/election.types.ts

export interface Category {
  id: string;
  name: string;
}

export interface Election {
  id: string;
  name: string;
  type: 'Presidencial' | 'Municipal' | 'Otros';
  startDate: string;
  endDate: string;
  allowNullVote: boolean;
  requireMinimumCategory: boolean;
  allowMultipleVotes: boolean;
  autoSendVote: boolean;
  categories: Category[];
  status: 'active' | 'finished' | 'upcoming';
  createdAt: string;
}

export interface ElectionFilters {
  name: string;
  type: 'Presidencial' | 'Municipal' | 'Otros'| 'all';
  status: 'active' | 'finished' | 'all';
  startDate: string;
  endDate: string;
}