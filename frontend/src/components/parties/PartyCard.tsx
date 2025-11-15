//Tarjeta de partido con menú 3 puntos
// src/components/parties/PartyCard.tsx

import { useState } from "react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import type { Party } from "@/types/party.types";

interface PartyCardProps {
  party: Party;
  onEdit: (party: Party) => void;
  onDelete: (partyId: string) => void;
}

export default function PartyCard({ party, onEdit, onDelete }: PartyCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)] relative">
      {/* Menú de 3 puntos */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center"
        >
          <MoreVertical size={20} className="text-gray-600" />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-10">
            <button
              onClick={() => {
                onEdit(party);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50"
            >
              <Edit size={16} />
              Modificar
            </button>
            <button
              onClick={() => {
                onDelete(party.id);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Logo del Partido */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 bg-white rounded-full overflow-hidden">
          <img 
            src={party.logoUrl || "https://via.placeholder.com/80"} 
            alt={party.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Información del Partido */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {party.name}
        </h3>
        <p className="text-sm text-gray-600">
          Representante: {party.representative}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {party.candidates.length} candidato{party.candidates.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}