// src/pages/admin/Parties/PartiesPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { useActiveElections } from "@/hooks/useActiveElections";
import ElectionCardForParties from "../../../components/parties/ElectionCardForParties";
import ElectionFiltersForParties from "../../../components/parties/ElectionFiltersForParties";

export default function PartiesPage() {
  const navigate = useNavigate();
  const { elections, loading } = useActiveElections();
  const [showFilters, setShowFilters] = useState(false);
  const [filteredElections, setFilteredElections] = useState(elections);

  // Aplicar filtros
  const handleFilter = (filters: { name: string; type: string; status: string }) => {
    let filtered = [...elections];

    // Filtro por nombre
    if (filters.name.trim()) {
      filtered = filtered.filter((e) =>
        e.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Filtro por tipo
    if (filters.type !== "all") {
      filtered = filtered.filter((e) => e.type === filters.type);
    }

    // Filtro por estado
    if (filters.status !== "all") {
      filtered = filtered.filter((e) => e.status === filters.status);
    }

    setFilteredElections(filtered);
  };

  // Navegar a la vista de partidos de la elección
  const handleElectionClick = (electionId: string) => {
    navigate(`/admin/parties/${electionId}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">Cargando elecciones...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Gestionar Partidos
        </h1>
        <p className="text-gray-600 text-sm">
          Seleccionar elecciones activas o por comenzar
        </p>
      </div>

      {/* Botón Filtros */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <SlidersHorizontal size={20} />
          Filtros
        </button>
      </div>

      <div className="flex gap-6">
        {/* Lista de Elecciones */}
        <div className="flex-1 space-y-4">
          {(filteredElections.length > 0 ? filteredElections : elections).length === 0 ? (
            <div className="bg-[#eaf2fc] rounded-[30px] p-12 shadow-[0_4px_12px_rgba(182,187,211,0.3)] text-center">
              <p className="text-gray-500 text-lg">
                No hay elecciones activas o por comenzar.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Crea una nueva elección en "Gestionar Elecciones"
              </p>
            </div>
          ) : (
            (filteredElections.length > 0 ? filteredElections : elections).map((election) => (
              <ElectionCardForParties
                key={election.id}
                election={election}
                onClick={() => handleElectionClick(election.id)}
              />
            ))
          )}
        </div>

        {/* Panel de Filtros */}
        {showFilters && (
          <ElectionFiltersForParties onFilterChange={handleFilter} />
        )}
      </div>
    </div>
  );
}