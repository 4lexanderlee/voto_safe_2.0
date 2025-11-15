//Modal flotante para agregar ---- El boton de verde en la vista de gestionar elecciones
// src/components/elections/AddElectionModal.tsx

import { useState } from "react";
import { X, Plus, Calendar } from "lucide-react";
import type { Election, Category } from "@/types/election.types";

interface AddElectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (election: Election) => void;
}

export default function AddElectionModal({ isOpen, onClose, onSave }: AddElectionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "Presidencial" as "Presidencial" | "Municipal" | "Otros",
    startDate: "",
    endDate: "",
    allowNullVote: false,
    requireMinimumCategory: false,
    allowMultipleVotes: false,
    autoSendVote: false,
  });

  const [categories, setCategories] = useState<Category[]>([
    { id: crypto.randomUUID(), name: "" },
  ]);

  const handleAddCategory = () => {
    setCategories([...categories, { id: crypto.randomUUID(), name: "" }]);
  };

  const handleCategoryChange = (id: string, value: string) => {
    setCategories(
      categories.map((cat) => (cat.id === id ? { ...cat, name: value } : cat))
    );
  };

  const handleRemoveCategory = (id: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  const handleSubmit = () => {
    // Validaciones básicas
    if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    const validCategories = categories.filter((cat) => cat.name.trim() !== "");
    if (validCategories.length === 0) {
      alert("Agrega al menos una categoría");
      return;
    }

    // Determinar estado según fechas
    const now = new Date();
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    let status: 'active' | 'finished' | 'upcoming' = 'upcoming';
    if (now >= start && now <= end) {
      status = 'active';
    } else if (now > end) {
      status = 'finished';
    }

    const newElection: Election = {
      id: crypto.randomUUID(),
      name: formData.name,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      allowNullVote: formData.allowNullVote,
      requireMinimumCategory: formData.requireMinimumCategory,
      allowMultipleVotes: formData.allowMultipleVotes,
      autoSendVote: formData.autoSendVote,
      categories: validCategories,
      status,
      createdAt: new Date().toISOString(),
    };

    onSave(newElection);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: "",
      type: "Presidencial",
      startDate: "",
      endDate: "",
      allowNullVote: false,
      requireMinimumCategory: false,
      allowMultipleVotes: false,
      autoSendVote: false,
    });
    setCategories([{ id: crypto.randomUUID(), name: "" }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-2xl font-semibold text-gray-800">
            Agregar Nueva Elección
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
          {/* Nombre de Elección */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Elección
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="ej. Elecciones Presidenciales"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "Presidencial" | "Municipal" | "Otros",
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d] cursor-pointer"
              >
                <option value="presencial">Presidencial</option>
                <option value="virtual">Municipal</option>
                <option value="virtual">Otros</option>
              </select>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
                />
                <Calendar
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
                />
                <Calendar
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <span className="text-sm text-gray-700">Permitir voto nulo?</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowNullVote}
                  onChange={(e) =>
                    setFormData({ ...formData, allowNullVote: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f366d]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <span className="text-sm text-gray-700">
                Marcar mínimo una categoría?
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requireMinimumCategory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requireMinimumCategory: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f366d]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <span className="text-sm text-gray-700">Votar varias veces?</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowMultipleVotes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allowMultipleVotes: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f366d]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <span className="text-sm text-gray-700">
                Enviar voto automáticamente al salir?
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoSendVote}
                  onChange={(e) =>
                    setFormData({ ...formData, autoSendVote: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f366d]"></div>
              </label>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Agregar Categorías
            </label>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) =>
                      handleCategoryChange(category.id, e.target.value)
                    }
                    placeholder="ej. Presidente"
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="w-10 h-10 bg-[#0f366d] text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center"
                  >
                    <Plus size={20} />
                  </button>
                  {categories.length > 1 && (
                    <button
                      onClick={() => handleRemoveCategory(category.id)}
                      className="w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 flex gap-4 rounded-b-3xl">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#0f366d] text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
          >
            AGREGAR
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