// src/hooks/useBallotsData.ts

import { useState, useEffect } from 'react';
import type { Election } from '@/types/election.types';
import type { VoteStatus } from '@/types/vote.types';
import { localStorageUtils } from '@/utils/localStorage';
import { voteStorageUtils } from '@/utils/voteStorage';

interface BallotData {
  election: Election;
  status: VoteStatus;
  canVote: boolean;
}

export const useBallotsData = (userId: string) => {
  const [ballots, setBallots] = useState<BallotData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBallots();
  }, [userId]);

  const loadBallots = () => {
    setLoading(true);
    try {
      const elections = localStorageUtils.getElections();
      
      const ballotsData: BallotData[] = elections.map((election) => {
        const status = voteStorageUtils.getBallotStatus(userId, election);
        const canVote = voteStorageUtils.canUserVote(userId, election);

        return {
          election,
          status,
          canVote,
        };
      });

      // Ordenar: ACTIVA primero, luego por fecha
      const sorted = ballotsData.sort((a, b) => {
        // Prioridad 1: ACTIVA primero
        if (a.status === 'ACTIVA' && b.status !== 'ACTIVA') return -1;
        if (a.status !== 'ACTIVA' && b.status === 'ACTIVA') return 1;

        // Prioridad 2: Por fecha de inicio
        return new Date(b.election.startDate).getTime() - new Date(a.election.startDate).getTime();
      });

      setBallots(sorted);
    } catch (error) {
      console.error('Error al cargar cédulas:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshBallots = () => {
    loadBallots();
  };

  return {
    ballots,
    loading,
    refreshBallots,
  };
};