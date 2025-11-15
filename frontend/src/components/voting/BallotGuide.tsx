//Guia de tres pasos
// src/components/voting/BallotGuide.tsx

import { Vote, CheckCircle, Send } from "lucide-react";

export default function BallotGuide() {
  return (
    <div className="w-80 bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)] h-fit">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
        Guía de Usuario
      </h3>

      {/* Paso 1 */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-[#0f366d] rounded-full flex items-center justify-center flex-shrink-0">
          <Vote className="text-white" size={24} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">PASO 1</h4>
          <p className="text-sm text-gray-600">
            Selecciona tu cédula de votación
          </p>
        </div>
      </div>

      {/* Paso 2 */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-[#0f366d] rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle className="text-white" size={24} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">PASO 2</h4>
          <p className="text-sm text-gray-600">
            Marca tus opciones en cada categoría
          </p>
        </div>
      </div>

      {/* Paso 3 */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#0f366d] rounded-full flex items-center justify-center flex-shrink-0">
          <Send className="text-white" size={24} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">PASO 3</h4>
          <p className="text-sm text-gray-600">
            Envía tu voto y confirma tu elección
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-300"></div>

      {/* Nota Importante */}
      <div className="bg-white rounded-xl p-4">
        <p className="text-xs text-gray-600 leading-relaxed">
          <strong>Importante:</strong> Una vez enviado tu voto, no podrás modificarlo a menos que la elección lo permita.
        </p>
      </div>
    </div>
  );
}