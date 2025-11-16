// src/pages/admin/Parties/PartyDetailPage.tsx

import { useState } from "react";
import { useParams } from "react-router-dom";
import { Upload } from "lucide-react";
import { useParties } from "@/hooks/useParties";
import { localStorageUtils } from "@/utils/localStorage";
import PartyCard from "@/components/parties/PartyCard";
import AddPartyModal from "@/components/parties/AddPartyModal";
import ImportCSVModal from "@/components/parties/ImportCSVModal";
import type { Party } from "@/types/party.types";

export default function PartyDetailPage() {
  const { electionId } = useParams<{ electionId: string }>();
  const { parties, loading, addParty, updateParty, deleteParty, addMultipleParties } = useParties(electionId);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);

  // Obtener datos de la elección
  const election = localStorageUtils.getElectionById(electionId || "");
  
  if (!election) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
        <p className="text-red-500 text-lg">Elección no encontrada</p>
      </div>
    );
  }

  const handleEditParty = (party: Party) => {
    setEditingParty(party);
    setShowAddModal(true);
  };

  const handleSaveParty = (partyData: Omit<Party, 'id' | 'electionId' | 'electionName' | 'createdAt'>) => {
    try {
      // ✅ LOG para verificar que logoUrl viene del modal
      console.log('📝 Datos recibidos del modal:', partyData);
      console.log('📝 logoUrl recibido:', partyData.logoUrl);
      
      // ✅ SOLUCIÓN: Construir el objeto explícitamente para asegurar que logoUrl se incluya
      const fullPartyData: Party = {
        id: editingParty?.id || crypto.randomUUID(),
        electionId: election.id,
        electionName: election.name,
        name: partyData.name,
        representative: partyData.representative,
        logoUrl: partyData.logoUrl, // ⬅️ CRÍTICO: Incluir explícitamente logoUrl
        candidates: partyData.candidates,
        createdAt: editingParty?.createdAt || new Date().toISOString(),
      };

      // ✅ LOG para verificar el partido completo antes de guardarlo
      console.log('💾 Partido completo a guardar:', fullPartyData);
      console.log('💾 logoUrl del partido:', fullPartyData.logoUrl);

      if (editingParty) {
        console.log('✏️ Actualizando partido existente');
        updateParty(editingParty.id, fullPartyData);
      } else {
        console.log('➕ Agregando nuevo partido');
        addParty(fullPartyData);
      }
      
      setShowAddModal(false);
      setEditingParty(null);
      
      console.log('✅ Partido guardado exitosamente');
    } catch (error) {
      console.error('❌ Error al guardar partido:', error);
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleDeleteParty = (partyId: string) => {
    if (confirm("¿Estás seguro de eliminar este partido?")) {
      deleteParty(partyId);
    }
  };

  const handleImportCSV = (importedParties: Omit<Party, 'id' | 'createdAt'>[]) => {
    const partiesWithMetadata: Party[] = importedParties.map(p => ({
      ...p,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }));

    addMultipleParties(partiesWithMetadata);
    setShowImportModal(false);
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
          <h1 className="text-3xl font-semibold text-gray-800 mb-2 uppercase">
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
          onClick={() => {
            setEditingParty(null);
            setShowAddModal(true);
          }}
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
        onImport={handleImportCSV}
      />
    </div>
  );
}