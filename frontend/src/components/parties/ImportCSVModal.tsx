//Modal importar CSV
// src/components/parties/ImportCSVModal.tsx

import { useState } from "react";
import { X, Upload, Search } from "lucide-react";
import type { Election } from "@/types/election.types";
import type { Party, Candidate, CSVRow } from "@/types/party.types";

interface ImportCSVModalProps {
  isOpen: boolean;
  election: Election;
  onClose: () => void;
  onImport: (parties: Omit<Party, 'id' | 'createdAt'>[]) => void;
}

export default function ImportCSVModal({ isOpen, election, onClose, onImport }: ImportCSVModalProps) {
  const [fileName, setFileName] = useState("");
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [eliminateDuplicates, setEliminateDuplicates] = useState(false);
  const [eliminateNulls, setEliminateNulls] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split("\n").filter(line => line.trim());
    if (lines.length < 2) return;

    // Asumiendo que la primera línea es el header
    const headers = lines[0].split(",").map(h => h.trim());
    
    const data: CSVRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim());
      data.push({
        partido: values[0] || "",
        representante: values[1] || "",
        url: values[2] || "",
        categoria: values[3] || "",
        nombres: values[4] || "",
        apellidos: values[5] || "",
        urlCandidato: values[6] || "",
        descripcion: values[7] || "",
        tema: (values[8] || "Otros") as any,
        sexo: (values[9] || "Otro") as any,
      });
    }

    setCsvData(data);
  };

  const processCSV = () => {
    let processedData = [...csvData];

    // Eliminar nulos
    if (eliminateNulls) {
      processedData = processedData.filter(row =>
        row.partido && row.representante && row.nombres && row.apellidos
      );
    }

    // Eliminar duplicados
    if (eliminateDuplicates) {
      const seen = new Set();
      processedData = processedData.filter(row => {
        const key = `${row.partido}-${row.categoria}-${row.nombres}-${row.apellidos}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    return processedData;
  };

  const handleImport = () => {
    const processedData = processCSV();

    // Agrupar por partido
    const partiesMap = new Map<string, Omit<Party, 'id' | 'createdAt'>>();

    processedData.forEach(row => {
      if (!partiesMap.has(row.partido)) {
        partiesMap.set(row.partido, {
          electionId: election.id,
          electionName: election.name,
          name: row.partido,
          representative: row.representante,
          logoUrl: row.url,
          candidates: [],
        });
      }

      const party = partiesMap.get(row.partido)!;
      
      // Buscar la categoría en la elección
      const category = election.categories.find(c => 
        c.name.toLowerCase() === row.categoria.toLowerCase()
      );

      if (category) {
        const candidate: Candidate = {
          id: crypto.randomUUID(),
          categoryId: category.id,
          categoryName: category.name,
          firstName: row.nombres,
          lastName: row.apellidos,
          imageUrl: row.urlCandidato || "",
          proposalDescription: row.descripcion || "",
          topic: row.tema,
          gender: row.sexo,
        };

        party.candidates.push(candidate);
      }
    });

    const parties = Array.from(partiesMap.values());
    onImport(parties);
    handleClose();
  };

  const handleClose = () => {
    setFileName("");
    setCsvData([]);
    setEliminateDuplicates(false);
    setEliminateNulls(false);
    setSearchTerm("");
    onClose();
  };

  const filteredData = csvData.filter(row =>
    searchTerm === "" ||
    Object.values(row).some(val =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-2xl font-semibold text-gray-800">Importar csv</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Nombre del archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingresa el nombre:
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Ingresa el nombre"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
            />
          </div>

          {/* Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingresa el archivo:
            </label>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
              <Upload size={48} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Ingresa el csv</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Búsqueda */}
          {csvData.length > 0 && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por datos o registros"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
                />
              </div>

              {/* Tabla Preview */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto max-h-80">
                  <table className="w-full">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Partido</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Representante</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">URL</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Categoría</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nombres</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Apellidos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((row, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="px-4 py-2 text-sm">{row.partido}</td>
                          <td className="px-4 py-2 text-sm">{row.representante}</td>
                          <td className="px-4 py-2 text-sm truncate max-w-xs">{row.url}</td>
                          <td className="px-4 py-2 text-sm">{row.categoria}</td>
                          <td className="px-4 py-2 text-sm">{row.nombres}</td>
                          <td className="px-4 py-2 text-sm">{row.apellidos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">Eliminar registros duplicados</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eliminateDuplicates}
                      onChange={(e) => setEliminateDuplicates(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f366d]"></div>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">Eliminar valores nulos</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eliminateNulls}
                      onChange={(e) => setEliminateNulls(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f366d]"></div>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {csvData.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 rounded-b-3xl">
            <button
              onClick={handleImport}
              className="w-full bg-[#0f366d] text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
            >
              SUBIR CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
}