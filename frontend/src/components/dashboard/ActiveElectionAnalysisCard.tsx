// src/components/dashboard/ActiveElectionAnalysisCard.tsx
import { BarChart3 } from "lucide-react";
import type { Election } from "@/types/election.types";

interface ActiveElectionAnalysisCardProps {
  election: Election | null; // Acepta null si no hay elecciones activas
}

export default function ActiveElectionAnalysisCard({
  election,
}: ActiveElectionAnalysisCardProps) {
  if (!election) {
    return (
      <div className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)] flex items-center justify-center">
        <p className="text-gray-500">No hay elecciones activas para analizar.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)] flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">{election.name}</h4>
        <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs rounded-full">
          Activa
        </span>
      </div>
      <BarChart3 className="text-[#0f366d]" size={64} />
    </div>
  );
}