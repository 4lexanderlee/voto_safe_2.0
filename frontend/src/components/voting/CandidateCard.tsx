//Tarjeta de candidato
// src/components/voting/CandidateCard.tsx

import { Check } from "lucide-react";
import type { Party, Candidate } from "@/types/party.types";

interface CandidateCardProps {
  party: Party;
  candidate: Candidate;
  isSelected: boolean;
  onSelect: () => void;
}

export default function CandidateCard({
  party,
  candidate,
  isSelected,
  onSelect,
}: CandidateCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative bg-white rounded-2xl p-6 cursor-pointer transition-all ${
        isSelected
          ? "border-4 border-green-500 shadow-lg"
          : "border-2 border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      {/* Check Icon */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="text-white" size={20} />
        </div>
      )}

      {/* Foto del Candidato */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          <img
            src={candidate.imageUrl || "https://via.placeholder.com/96"}
            alt={`${candidate.firstName} ${candidate.lastName}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Nombre del Candidato */}
      <h4 className="text-center font-semibold text-gray-800 mb-1">
        {candidate.firstName}
      </h4>
      <h4 className="text-center font-semibold text-gray-800 mb-4">
        {candidate.lastName}
      </h4>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Logo del Partido */}
      <div className="flex justify-center mb-2">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
          <img
            src={party.logoUrl || "https://via.placeholder.com/64"}
            alt={party.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Nombre del Partido */}
      <p className="text-center text-sm font-medium text-gray-700">
        {party.name}
      </p>
    </div>
  );
}