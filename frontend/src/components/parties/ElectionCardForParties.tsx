// src/components/parties/ElectionCardForParties.tsx

import { FileText, BarChart3, Calendar } from "lucide-react";
import type { Election } from "@/types/election.types";

interface ElectionCardForPartiesProps {
  election: Election;
  onClick: () => void;
}

export default function ElectionCardForParties({
  election,
  onClick,
}: ElectionCardForPartiesProps) {
  const getStatusBadge = () => {
    const badges = {
      active: { label: "ACTIVA", color: "bg-green-500" },
      upcoming: { label: "POR COMENZAR", color: "bg-red-500" },
      finished: { label: "FINALIZADA", color: "bg-gray-500" },
    };
    return badges[election.status];
  };

  const badge = getStatusBadge();

  return (
    <div
      onClick={onClick}
      className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)] relative cursor-pointer hover:shadow-[0_6px_16px_rgba(182,187,211,0.4)] transition-all"
    >
      {/* Status Badge */}
      <span
        className={`absolute top-6 right-6 px-4 py-1 ${badge.color} text-white text-xs font-medium rounded-full`}
      >
        {badge.label}
      </span>

      {/* Título */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pr-32 uppercase">
        {election.name}
      </h3>

      {/* Información en Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Tipo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <FileText className="text-[#0f366d]" size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500">TIPO</p>
            <p className="text-sm font-medium text-gray-800 uppercase">
              {election.type}
            </p>
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
              {new Date(election.startDate).toLocaleDateString("es-ES")} -{" "}
              {new Date(election.endDate).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}