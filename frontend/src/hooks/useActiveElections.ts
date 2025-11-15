// src/hooks/useActiveElections.ts

import { useState, useEffect } from 'react';
import type { Election } from '@/types/election.types';
import { localStorageUtils } from '@/utils/localStorage';

export const useActiveElections = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActiveElections();
  }, []);

  const loadActiveElections = () => {
    setLoading(true);
    try {
      const allElections = localStorageUtils.getElections();
      
      // Filtrar solo elecciones activas o por comenzar
      const activeElections = allElections.filter(
        (election) => election.status === 'active' || election.status === 'upcoming'
      );
      
      // Ordenar por fecha de inicio (más recientes primero)
      const sorted = activeElections.sort((a, b) => {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });
      
      setElections(sorted);
    } catch (error) {
      console.error('Error al cargar elecciones activas:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    elections,
    loading,
    loadActiveElections,
  };
};