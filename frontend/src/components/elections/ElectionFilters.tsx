//Panel de filtros lateral
// src/components/elections/ElectionFilters.tsx

import type { ElectionFilters as Filters } from "@/types/election.types";

interface ElectionFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
}

export default function ElectionFilters({ filters, onFilterChange }: ElectionFiltersProps) {
  return (
    <div className="w-80 bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)] h-fit">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Filtros</h3>

      {/* Filtro Nombre */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre:
        </label>
        <input
          type="text"
          value={filters.name}
          onChange={(e) => onFilterChange({ name: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
          placeholder="Buscar..."
        />
      </div>

      {/* Filtro Tipo */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo:
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipo"
              checked={filters.type === 'Presidencial'}
              onChange={() => onFilterChange({ type: 'Presidencial' })}
              className="w-4 h-4 text-[#0f366d]"
            />
            <span className="text-sm">Presencial</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipo"
              checked={filters.type === 'Municipal'}
              onChange={() => onFilterChange({ type: 'Municipal' })}
              className="w-4 h-4 text-[#0f366d]"
            />
            <span className="text-sm">Virtual</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipo"
              checked={filters.type === 'Otros'}
              onChange={() => onFilterChange({ type: 'Otros' })}
              className="w-4 h-4 text-[#0f366d]"
            />
            <span className="text-sm">Virtual</span>
          </label>
        </div>
      </div>

      {/* Filtro Estado */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado:
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="estado"
              checked={filters.status === 'active'}
              onChange={() => onFilterChange({ status: 'active' })}
              className="w-4 h-4 text-[#0f366d]"
            />
            <span className="text-sm">Activo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="estado"
              checked={filters.status === 'finished'}
              onChange={() => onFilterChange({ status: 'finished' })}
              className="w-4 h-4 text-[#0f366d]"
            />
            <span className="text-sm">Finalizado</span>
          </label>
        </div>
      </div>

      {/* Filtro Período */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Período (desde):
        </label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange({ startDate: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Período (hasta):
        </label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange({ endDate: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
        />
      </div>
    </div>
  );
}