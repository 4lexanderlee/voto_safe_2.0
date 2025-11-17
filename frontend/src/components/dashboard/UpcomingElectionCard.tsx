// src/components/dashboard/UpcomingElectionCard.tsx
import { Calendar } from "lucide-react";
import type { Election } from "@/types/election.types";

interface UpcomingElectionCardProps {
  election: Election | null; // Acepta null para la tarjeta "Proximamente"
}

export default function UpcomingElectionCard({ election }: UpcomingElectionCardProps) {
  const name = election?.name || "Proximamente";
  const dates = election
    ? `${new Date(election.startDate).toLocaleDateString("es-ES")} - ${new Date(
        election.endDate
      ).toLocaleDateString("es-ES")}`
    : "-";

  return (
    <div className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)]">
      <div className="flex items-start gap-4 mb-4">
        <Calendar className="text-[#0f366d]" size={32} />
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-600">{dates}</p>
        </div>
      </div>
    </div>
  );
}