// src/components/parties/ElectionFiltersForParties.tsx

import { useState } from "react";

interface FiltersState {
  name: string;
  type: "all" | "Presidencial" | "Municipal" | "Otros";
  status: "all" | "active" | "upcoming";
}

interface ElectionFiltersForPartiesProps {
  onFilterChange: (filters: FiltersState) => void;
}

export default function ElectionFiltersForParties({
  onFilterChange,
}: ElectionFiltersForPartiesProps) {
  const [filters, setFilters] = useState<FiltersState>({
    name: "",
    type: "all",
    status: "all",
  });

  const handleChange = (newFilters: Partial<FiltersState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

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
          onChange={(e) => handleChange({ name: e.target.value })}
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
              checked={filters.type === "all"}
              onChange={() => handleChange({ type: "all" })}
              className="w-4 h-4 text-[#0f366d]"
            />
            <span className="text-sm">Todos</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipo"
              checked={filters.type === "Presidencial"}
              onChange={() => handleChange({ type: "Presidencial" })}
              className="w-4 h-4 text-[#0f366d]"
            />
            <span className="text-sm">Presidencial</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipo"
              checked={filters.type === "Municipal"}
              onChange={() => handleChange({ type: "Municipal" })}
              className="w-4 h-4 text-[#0f366d]"
            />
            <span className="text-sm">Municipal</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipo"
              checked={filters.type === "Otros"}
              onChange={() => handleChange({ type: "Otros" })}
              className="w-4 h-4 text-[#0f366d]"
            />
            <span className="text-sm">Otros</span>
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
              checked={filters.status === "all"}
              onChange={() => handleChange({ status: "all" })}
              className="w-4 h-4 text-[#0f366d]"
            />
            <span className="text-sm">Todos</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="estado"
              checked={filters.status === "active"}
              onChange={() => handleChange({ status: "active" })}
              className="w-4 h-4 text-[#0f366d]"
            />
            <span className="text-sm">Activo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="estado"
              checked={filters.status === "upcoming"}
              onChange={() => handleChange({ status: "upcoming" })}
              className="w-4 h-4 text-[#0f366d]"
            />
            <span className="text-sm">Por Comenzar</span>
          </label>
        </div>
      </div>
    </div>
  );
}