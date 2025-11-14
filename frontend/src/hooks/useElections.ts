//Lógica de localStorage
// src/hooks/useElections.ts

import { useState, useEffect } from 'react';
import type { Election, ElectionFilters } from '@/types/election.types';
import { localStorageUtils } from '@/utils/localStorage';

export const useElections = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [filteredElections, setFilteredElections] = useState<Election[]>([]);
  const [filters, setFilters] = useState<ElectionFilters>({
    name: '',
    type: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
  });

  // Cargar elecciones al montar
  useEffect(() => {
    loadElections();
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    applyFilters();
  }, [elections, filters]);

  const loadElections = () => {
    const data = localStorageUtils.getElections();
    setElections(data);
  };

  const addElection = (election: Election) => {
    localStorageUtils.addElection(election);
    loadElections();
  };

  const updateElection = (id: string, election: Election) => {
    localStorageUtils.updateElection(id, election);
    loadElections();
  };

  const deleteElection = (id: string) => {
    localStorageUtils.deleteElection(id);
    loadElections();
  };

  const applyFilters = () => {
    let filtered = [...elections];

    // Filtro por nombre
    if (filters.name.trim()) {
      filtered = filtered.filter((e) =>
        e.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Filtro por tipo
    if (filters.type !== 'all') {
      filtered = filtered.filter((e) => e.type === filters.type);
    }

    // Filtro por estado
    if (filters.status !== 'all') {
      filtered = filtered.filter((e) => e.status === filters.status);
    }

    // Filtro por rango de fechas
    if (filters.startDate) {
      filtered = filtered.filter((e) => e.startDate >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter((e) => e.endDate <= filters.endDate);
    }

    setFilteredElections(filtered);
  };

  const updateFilters = (newFilters: Partial<ElectionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    elections: filteredElections,
    filters,
    addElection,
    updateElection,
    deleteElection,
    updateFilters,
    loadElections,
  };
};