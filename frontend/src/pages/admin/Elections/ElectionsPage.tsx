// src/pages/admin/Elections/ElectionsPage.tsx
import { useState } from "react";
import { FileText, BarChart3, Calendar, Trash2, Edit, SlidersHorizontal } from "lucide-react";

interface Election {
  id: string;
  title: string;
  type: string;
  categories: number;
  period: string;
  status: "active" | "finished" | "upcoming";
}

export default function ElectionsPage() {
  const [elections] = useState<Election[]>([
    {
      id: "1",
      title: "ELECCIONES PRESIDENCIALES 2025",
      type: "PRESENCIAL",
      categories: 5,
      period: "09/04/25 - 09/04/25",
      status: "finished"
    },
    {
      id: "2",
      title: "ELECCIONES PRESIDENCIALES 2026",
      type: "PRESENCIAL",
      categories: 5,
      period: "09/04/26 - 09/04/25",
      status: "active"
    }
  ]);

  const [showFilters, setShowFilters] = useState(true);
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("Presencial");
  const [filterStatus, setFilterStatus] = useState("Activo");
  const [filterPeriod, setFilterPeriod] = useState("09/04/25");

  const handleDelete = (id: string) => {
    console.log("Eliminar elección:", id);
  };

  const handleModify = (id: string) => {
    console.log("Modificar elección:", id);
  };

  const handleAdd = () => {
    console.log("Agregar nueva elección");
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Gestionar Elecciones
        </h1>
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
          {elections.map((election) => (
            <div
              key={election.id}
              className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)] relative"
            >
              {/* Status Badge */}
              {election.status === "finished" && (
                <span className="absolute top-6 right-6 px-4 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                  POR COMENZAR
                </span>
              )}
              {election.status === "active" && (
                <span className="absolute top-6 right-6 px-4 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                  ACTIVA
                </span>
              )}

              {/* Título */}
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pr-32">
                {election.title}
              </h3>

              {/* Información en Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Tipo */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <FileText className="text-[#0f366d]" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">TIPO</p>
                    <p className="text-sm font-medium text-gray-800">{election.type}</p>
                  </div>
                </div>

                {/* Categorías */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-[#0f366d]" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">CATEGORÍAS</p>
                    <p className="text-sm font-medium text-gray-800">{election.categories} CATEGORÍAS</p>
                  </div>
                </div>

                {/* Período */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <Calendar className="text-[#0f366d]" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">PERÍODO</p>
                    <p className="text-sm font-medium text-gray-800">{election.period}</p>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(election.id)}
                  className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                  ELIMINAR
                </button>
                <button
                  onClick={() => handleModify(election.id)}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors"
                >
                  <Edit size={18} />
                  MODIFICAR
                </button>
              </div>
            </div>
          ))}

          {/* Botón Agregar */}
          <button
            onClick={handleAdd}
            className="w-full bg-green-500 text-white py-4 rounded-[30px] font-semibold text-lg hover:bg-green-600 transition-colors shadow-[0_4px_12px_rgba(182,187,211,0.3)]"
          >
            + AGREGAR
          </button>
        </div>

        {/* Panel de Filtros */}
        {showFilters && (
          <div className="w-80 bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)] h-fit">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Filtros</h3>

            {/* Filtro Nombre */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre:
              </label>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
                placeholder="Buscar..."
              />
            </div>

            {/* Filtro Tipo */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo:
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tipo"
                    checked={filterType === "Presencial"}
                    onChange={() => setFilterType("Presencial")}
                    className="w-4 h-4 text-[#0f366d]"
                  />
                  <span className="text-sm">Presencial</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tipo"
                    checked={filterType === "Virtual"}
                    onChange={() => setFilterType("Virtual")}
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
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="estado"
                    checked={filterStatus === "Activo"}
                    onChange={() => setFilterStatus("Activo")}
                    className="w-4 h-4 text-[#0f366d]"
                  />
                  <span className="text-sm">Activo</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="estado"
                    checked={filterStatus === "Finalizado"}
                    onChange={() => setFilterStatus("Finalizado")}
                    className="w-4 h-4 text-[#0f366d]"
                  />
                  <span className="text-sm">Finalizado</span>
                </label>
              </div>
            </div>

            {/* Filtro Período */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período:
              </label>
              <input
                type="date"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}