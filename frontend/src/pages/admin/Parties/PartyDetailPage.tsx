// src/pages/admin/Parties/PartyDetailPage.tsx

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, Plus } from "lucide-react";
import { useParties } from "@/hooks/useParties";
import { localStorageUtils } from "@/utils/localStorage";
import PartyCard from "@/components/parties/PartyCard";
import AddPartyModal from "@/components/parties/AddPartyModal";
import ImportCSVModal from "@/components/parties/ImportCSVModal";

export default function PartyDetailPage() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { parties, loading, addParty, updateParty, deleteParty } = useParties(electionId);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingParty, setEditingParty] = useState(null);

  // Obtener datos de la elección
  const election = localStorageUtils.getElectionById(electionId);
  
  if (!election) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
        <p className="text-red-500 text-lg">Elección no encontrada</p>
      </div>
    );
  }

  const handleEditParty = (party) => {
    setEditingParty(party);
    setShowAddModal(true);
  };

  const handleSaveParty = (partyData) => {
    try {
      if (editingParty) {
        updateParty(editingParty.id, {
          ...partyData,
          electionId,
          electionName: election.name,
        });
      } else {
        addParty({
          ...partyData,
          electionId,
          electionName: election.name,
        });
      }
      setShowAddModal(false);
      setEditingParty(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteParty = (partyId) => {
    if (confirm("¿Estás seguro de eliminar este partido?")) {
      deleteParty(partyId);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">Cargando partidos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            {election.name}
          </h1>
          <p className="text-gray-600 text-sm">
            Gestionar Partidos - {election.categories.length} categorías
          </p>
        </div>
        
        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#0f366d] text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Upload size={20} />
          Importar CSV
        </button>
      </div>

      {/* Grid de Partidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {parties.length === 0 ? (
          <div className="col-span-full bg-[#eaf2fc] rounded-[30px] p-12 shadow-[0_4px_12px_rgba(182,187,211,0.3)] text-center">
            <p className="text-gray-500 text-lg">
              No hay partidos registrados para esta elección.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Agrega el primer partido usando el botón "AGREGAR"
            </p>
          </div>
        ) : (
          parties.map((party) => (
            <PartyCard
              key={party.id}
              party={party}
              onEdit={handleEditParty}
              onDelete={handleDeleteParty}
            />
          ))
        )}
      </div>

      {/* Botón Agregar */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-500 text-white py-4 px-12 rounded-[30px] font-semibold text-lg hover:bg-green-600 transition-colors shadow-[0_4px_12px_rgba(182,187,211,0.3)]"
        >
          + AGREGAR
        </button>
      </div>

      {/* Modales */}
      <AddPartyModal
        isOpen={showAddModal}
        election={election}
        party={editingParty}
        onClose={() => {
          setShowAddModal(false);
          setEditingParty(null);
        }}
        onSave={handleSaveParty}
      />

      <ImportCSVModal
        isOpen={showImportModal}
        election={election}
        onClose={() => setShowImportModal(false)}
        onImport={(parties) => {
          // Aquí irá la lógica de importación
          console.log("Importar partidos:", parties);
        }}
      />
    </div>
  );
}