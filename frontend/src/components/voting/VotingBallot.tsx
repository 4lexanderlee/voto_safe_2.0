//Cedula completa
// src/components/voting/VotingBallot.tsx

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Election } from "@/types/election.types";
import { useVoting } from "@/hooks/useVoting";
import CandidateCard from "./CandidateCard";

interface VotingBallotProps {
  election: Election;
  userId: string;
  onVoteSubmitted: () => void;
  onCancel: () => void;
}

export default function VotingBallot({
  election,
  userId,
  onVoteSubmitted,
  onCancel,
}: VotingBallotProps) {
  const {
    currentCategory,
    currentCategoryIndex,
    totalCategories,
    selections,
    candidates,
    selectCandidate,
    goToNextCategory,
    goToPreviousCategory,
    canGoNext,
    canGoPrevious,
    isLastCategory,
    submitVote,
    canSubmitVote,
  } = useVoting(election, userId);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = () => {
    setSubmitError("");
    const validation = canSubmitVote();
    
    if (!validation.valid) {
      setSubmitError(validation.message);
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSubmit = () => {
    const result = submitVote();
    
    if (result.success) {
      setShowConfirmModal(false);
      onVoteSubmitted();
    } else {
      setSubmitError(result.message);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Logo ONPE */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Logotipo_ONPE_%282024%29.svg/1200px-Logotipo_ONPE_%282024%29.svg.png"
          alt="ONPE"
          className="h-12"
        />
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors"
        >
          CANCELAR
        </button>
      </div>

      {/* Título de la Elección */}
      <div className="bg-[#0f366d] text-white text-center py-4">
        <h1 className="text-2xl font-bold uppercase">{election.name}</h1>
      </div>

      {/* Tabs de Categorías */}
      <div className="bg-gray-100 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-8 py-2 flex gap-2 overflow-x-auto">
          {election.categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => {
                // Permitir navegación directa si ya hay selección
                if (selections[category.id] || index <= currentCategoryIndex) {
                  // Lógica de navegación directa
                }
              }}
              className={`px-6 py-2 rounded-t-lg font-medium whitespace-nowrap transition-colors ${
                index === currentCategoryIndex
                  ? "bg-[#0f366d] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {category.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido - Grid de Candidatos */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {currentCategory.name.toUpperCase()}
        </h2>

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        {/* Grid de Candidatos */}
        {candidates.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No hay candidatos registrados para esta categoría
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {candidates.map(({ party, candidate }) => (
              <CandidateCard
                key={`${party.id}-${candidate.id}`}
                party={party}
                candidate={candidate}
                isSelected={selections[currentCategory.id] === party.id}
                onSelect={() => selectCandidate(party.id)}
              />
            ))}
          </div>
        )}

        {/* Botones de Navegación */}
        <div className="flex items-center justify-between mt-8">
          {/* Botón ATRÁS */}
          <button
            onClick={goToPreviousCategory}
            disabled={!canGoPrevious}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-colors ${
              canGoPrevious
                ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ArrowLeft size={20} />
            ATRÁS
          </button>

          {/* Indicador de Progreso */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Categoría {currentCategoryIndex + 1} de {totalCategories}
            </p>
          </div>

          {/* Botón ADELANTE o ENVIAR */}
          {isLastCategory ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 bg-[#0f366d] text-white rounded-full font-semibold hover:bg-blue-800 transition-colors"
            >
              ENVIAR
            </button>
          ) : (
            <button
              onClick={goToNextCategory}
              disabled={!canGoNext}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-colors ${
                canGoNext
                  ? "bg-[#0f366d] text-white hover:bg-blue-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              ADELANTE
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-96 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              ¿Confirmar voto?
            </h3>
            <p className="text-gray-600 mb-6">
              {Object.keys(selections).length === 0
                ? "Vas a enviar un voto NULO. ¿Estás seguro?"
                : `Has seleccionado ${Object.keys(selections).length} de ${totalCategories} categorías. ¿Deseas enviar tu voto?`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 px-4 py-2 bg-[#0f366d] text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}