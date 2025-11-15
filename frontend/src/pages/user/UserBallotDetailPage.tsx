// src/pages/user/UserBallotDetailPage.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { localStorageUtils } from "@/utils/localStorage";
import { voteStorageUtils } from "@/utils/voteStorage";
import VotingBallot from "@/components/voting/VotingBallot";

export default function UserBallotDetailPage() {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || !electionId) {
    navigate("/auth/login");
    return null;
  }

  const election = localStorageUtils.getElectionById(electionId);

  if (!election) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-lg">Elección no encontrada</p>
      </div>
    );
  }

  // Verificar si puede votar
  const canVote = voteStorageUtils.canUserVote(user.id, election);

  if (!canVote) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            No puedes votar en esta elección
          </h2>
          <p className="text-gray-600 mb-6">
            Ya has votado o la elección no está disponible en este momento.
          </p>
          <button
            onClick={() => navigate("/user/ballots")}
            className="px-6 py-3 bg-[#0f366d] text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Volver a Mis Cédulas
          </button>
        </div>
      </div>
    );
  }

  const handleVoteSubmitted = () => {
    // Mostrar mensaje de éxito
    alert("¡Voto enviado exitosamente!");
    
    // Redirigir a la lista de cédulas
    navigate("/user/ballots");
  };

  const handleCancel = () => {
    if (confirm("¿Estás seguro de cancelar? Se perderán tus selecciones.")) {
      navigate("/user/ballots");
    }
  };

  return (
    <VotingBallot
      election={election}
      userId={user.id}
      onVoteSubmitted={handleVoteSubmitted}
      onCancel={handleCancel}
    />
  );
}