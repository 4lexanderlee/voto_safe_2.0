//Modal agregar manual
// src/components/parties/AddPartyModal.tsx

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import type { Party, Candidate, Topic, Gender } from "@/types/party.types";
import type { Election } from "@/types/election.types";

interface AddPartyModalProps {
  isOpen: boolean;
  election: Election;
  party: Party | null;
  onClose: () => void;
  onSave: (partyData: Omit<Party, 'id' | 'electionId' | 'electionName' | 'createdAt'>) => void;
}

export default function AddPartyModal({ isOpen, election, party, onClose, onSave }: AddPartyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    representative: "",
    logoUrl: "",
  });

  const [candidates, setCandidates] = useState<Omit<Candidate, 'id'>[]>([]);

  // Inicializar candidatos vacíos para cada categoría
  useEffect(() => {
    if (isOpen && election) {
      if (party) {
        // Modo edición
        setFormData({
          name: party.name,
          representative: party.representative,
          logoUrl: party.logoUrl,
        });
        setCandidates(party.candidates.map(c => ({
          categoryId: c.categoryId,
          categoryName: c.categoryName,
          firstName: c.firstName,
          lastName: c.lastName,
          imageUrl: c.imageUrl,
          proposalDescription: c.proposalDescription,
          topic: c.topic,
          gender: c.gender,
        })));
      } else {
        // Modo crear: inicializar candidatos vacíos para cada categoría
        const initialCandidates = election.categories.map(category => ({
          categoryId: category.id,
          categoryName: category.name,
          firstName: "",
          lastName: "",
          imageUrl: "",
          proposalDescription: "",
          topic: "Otros" as Topic,
          gender: "Otro" as Gender,
        }));
        setCandidates(initialCandidates);
      }
    }
  }, [isOpen, election, party]);

  const handleCandidateChange = (categoryId: string, field: keyof Omit<Candidate, 'id'>, value: string) => {
    setCandidates(prev =>
      prev.map(c =>
        c.categoryId === categoryId ? { ...c, [field]: value } : c
      )
    );
  };

  const handleSubmit = () => {
    // Validaciones
    if (!formData.name.trim()) {
      alert("Ingresa el nombre del partido");
      return;
    }
    if (!formData.representative.trim()) {
      alert("Ingresa el representante del partido");
      return;
    }
    if (!formData.logoUrl.trim()) {
      alert("Ingresa la URL del logo del partido");
      return;
    }

    // Validar que todos los candidatos tengan datos
    const incompleteCandidates = candidates.filter(
      c => !c.firstName.trim() || !c.lastName.trim()
    );
    if (incompleteCandidates.length > 0) {
      alert("Completa los datos de todos los candidatos");
      return;
    }

    // Crear candidatos con IDs
    const candidatesWithIds: Candidate[] = candidates.map(c => ({
      ...c,
      id: crypto.randomUUID(),
    }));

    onSave({
      name: formData.name,
      representative: formData.representative,
      logoUrl: formData.logoUrl,
      candidates: candidatesWithIds,
    });

    handleClose();
  };

  const handleClose = () => {
    setFormData({ name: "", representative: "", logoUrl: "" });
    setCandidates([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            {party ? "Modificar Partido" : "Agregar Nuevo Partido"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Datos del Partido */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del partido
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ej. Fuerza Popular"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Representante del Partido
              </label>
              <input
                type="text"
                value={formData.representative}
                onChange={(e) => setFormData({ ...formData, representative: e.target.value })}
                placeholder="ej. Keiko Fujimori"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Url de la imagen del partido
            </label>
            <input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="https://ejemplo.com/logo.png"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
            />
          </div>

          {/* Candidatos por Categoría */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Agregar Candidatos por categoría
            </h3>

            {candidates.map((candidate) => (
              <div
                key={candidate.categoryId}
                className="bg-gray-50 rounded-2xl p-6 mb-4"
              >
                <h4 className="text-md font-semibold text-gray-800 mb-4">
                  Categoría {candidate.categoryName}
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Nombres</label>
                    <input
                      type="text"
                      value={candidate.firstName}
                      onChange={(e) =>
                        handleCandidateChange(candidate.categoryId, "firstName", e.target.value)
                      }
                      placeholder="ej. Juan Carlos"
                      className="w-full px-4 py-2 rounded-xl bg-white border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Apellidos</label>
                    <input
                      type="text"
                      value={candidate.lastName}
                      onChange={(e) =>
                        handleCandidateChange(candidate.categoryId, "lastName", e.target.value)
                      }
                      placeholder="ej. García López"
                      className="w-full px-4 py-2 rounded-xl bg-white border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-1">
                    Url de la imagen del candidato
                  </label>
                  <input
                    type="text"
                    value={candidate.imageUrl}
                    onChange={(e) =>
                      handleCandidateChange(candidate.categoryId, "imageUrl", e.target.value)
                    }
                    placeholder="https://ejemplo.com/candidato.jpg"
                    className="w-full px-4 py-2 rounded-xl bg-white border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Sexo</label>
                    <select
                      value={candidate.gender}
                      onChange={(e) =>
                        handleCandidateChange(candidate.categoryId, "gender", e.target.value as Gender)
                      }
                      className="w-full px-4 py-2 rounded-xl bg-white border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d] cursor-pointer"
                    >
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Tema</label>
                    <select
                      value={candidate.topic}
                      onChange={(e) =>
                        handleCandidateChange(candidate.categoryId, "topic", e.target.value as Topic)
                      }
                      className="w-full px-4 py-2 rounded-xl bg-white border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d] cursor-pointer"
                    >
                      <option value="Salud">Salud</option>
                      <option value="Economía">Economía</option>
                      <option value="Educación">Educación</option>
                      <option value="Seguridad">Seguridad</option>
                      <option value="Política">Política</option>
                      <option value="Interior">Interior</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Aquí una descripción de las propuestas del candidato según tema...
                  </label>
                  <textarea
                    value={candidate.proposalDescription}
                    onChange={(e) =>
                      handleCandidateChange(candidate.categoryId, "proposalDescription", e.target.value)
                    }
                    placeholder="Describe las propuestas..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl bg-white border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d] resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 flex gap-4 rounded-b-3xl">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#0f366d] text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
          >
            {party ? "GUARDAR CAMBIOS" : "AGREGAR"}
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
}