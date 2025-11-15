 //Tarjeta individual de elección --- al momento de agregar una elecion se usa
 // src/components/elections/ElectionCard.tsx

import { FileText, BarChart3, Calendar, Trash2, Edit } from "lucide-react";
import type { Election } from "@/types/election.types";

interface ElectionCardProps {
  election: Election;
  onDelete: (id: string) => void;
  onEdit: (election: Election) => void;
}

export default function ElectionCard({ election, onDelete, onEdit }: ElectionCardProps) {
  const getStatusBadge = () => {
    const badges = {
      finished: { label: "POR COMENZAR", color: "bg-red-500" },
      active: { label: "ACTIVA", color: "bg-green-500" },
      upcoming: { label: "PRÓXIMAMENTE", color: "bg-blue-500" },
    };
    return badges[election.status];
  };

  const badge = getStatusBadge();

  return (
    <div className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)] relative">
      {/* Status Badge */}
      <span className={`absolute top-6 right-6 px-4 py-1 ${badge.color} text-white text-xs font-medium rounded-full`}>
        {badge.label}
      </span>

      {/* Título */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pr-32 uppercase">
        {election.name}
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
            <p className="text-sm font-medium text-gray-800 uppercase">{election.type}</p>
          </div>
        </div>

        {/* Categorías */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <BarChart3 className="text-[#0f366d]" size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500">CATEGORÍAS</p>
            <p className="text-sm font-medium text-gray-800">
              {election.categories.length} CATEGORÍAS
            </p>
          </div>
        </div>

        {/* Período */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <Calendar className="text-[#0f366d]" size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500">PERÍODO</p>
            <p className="text-sm font-medium text-gray-800">
              {new Date(election.startDate).toLocaleDateString('es-ES')} - {new Date(election.endDate).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-3">
        <button
          onClick={() => onDelete(election.id)}
          className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <Trash2 size={18} />
          ELIMINAR
        </button>
        <button
          onClick={() => onEdit(election)}
          className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors"
        >
          <Edit size={18} />
          MODIFICAR
        </button>
      </div>
    </div>
  );
}