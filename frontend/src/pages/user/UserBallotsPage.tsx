// src/pages/user/UserBallotsPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBallotsData } from "@/hooks/useBallotsData";
import BallotCard from "@/components/voting/BallotCard";
import BallotGuide from "@/components/voting/BallotGuide";

export default function UserBallotsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ballots, loading } = useBallotsData(user?.id || "");
  const [showGuide, setShowGuide] = useState(true);

  if (!user) {
    navigate("/");
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">Cargando cédulas...</p>
      </div>
    );
  }

  const handleBallotClick = (electionId: string, canVote: boolean) => {
    if (!canVote) {
      alert("No puedes votar en esta elección en este momento");
      return;
    }
    navigate(`/user/ballots/${electionId}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Mis Cédulas de Votación
          </h1>
          <p className="text-gray-600">
            Selecciona una elección para emitir tu voto
          </p>
        </div>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {showGuide ? "Ocultar Guía" : "Mostrar Guía"}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Lista de Cédulas */}
        <div className="flex-1 space-y-4">
          {ballots.length === 0 ? (
            <div className="bg-[#eaf2fc] rounded-[30px] p-12 shadow-[0_4px_12px_rgba(182,187,211,0.3)] text-center">
              <p className="text-gray-500 text-lg">
                No hay cédulas de votación disponibles.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Las elecciones aparecerán aquí cuando estén activas.
              </p>
            </div>
          ) : (
            ballots.map(({ election, status, canVote }) => (
              <BallotCard
                key={election.id}
                election={election}
                status={status}
                onClick={() => handleBallotClick(election.id, canVote)}
              />
            ))
          )}
        </div>

        {/* Panel de Guía */}
        {showGuide && <BallotGuide />}
      </div>
    </div>
  );
}