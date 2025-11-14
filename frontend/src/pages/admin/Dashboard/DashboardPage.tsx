// src/pages/admin/Dashboard/DashboardPage.tsx
import { ArrowUp, Calendar, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Saludo */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Hola, Jose Mario
      </h1>

      {/* Cards de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1: Elecciones Vigentes */}
        <div className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)]">
          <h3 className="text-sm text-gray-600 mb-2">Elecciones Vigentes</h3>
          <p className="text-5xl font-bold text-gray-800">1</p>
        </div>

        {/* Card 2: Total de Usuarios */}
        <div className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)]">
          <h3 className="text-sm text-gray-600 mb-2">Total de Usuarios</h3>
          <div className="flex items-center gap-2">
            <ArrowUp className="text-green-600" size={32} />
            <p className="text-5xl font-bold text-gray-800">+10M</p>
          </div>
        </div>

        {/* Card 3: Votos vs Usuarios */}
        <div className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)]">
          <h3 className="text-sm text-gray-600 mb-2">Votos vs Usuarios</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Círculo de progreso simple */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">80</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Del total de usuarios
          </p>
        </div>
      </div>

      {/* Próximas Elecciones */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Próximas Elecciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Elección */}
          <div className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)]">
            <div className="flex items-start gap-4 mb-4">
              <Calendar className="text-[#0f366d]" size={32} />
              <div>
                <h4 className="font-semibold text-gray-800">
                  Elecciones Presidenciales 2026
                </h4>
                <p className="text-sm text-gray-600">05/05 - 05/06</p>
              </div>
            </div>
          </div>

          <div className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)]">
            <div className="flex items-start gap-4 mb-4">
              <Calendar className="text-[#0f366d]" size={32} />
              <div>
                <h4 className="font-semibold text-gray-800">
                  Elecciones Municipales 2027
                </h4>
                <p className="text-sm text-gray-600">05/08 - 25/08</p>
              </div>
            </div>
          </div>

          <div className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)]">
            <div className="flex items-start gap-4 mb-4">
              <Calendar className="text-[#0f366d]" size={32} />
              <div>
                <h4 className="font-semibold text-gray-800">Proximamente</h4>
                <p className="text-sm text-gray-600">-</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Análisis por Elecciones */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Análisis por Elecciones
        </h2>
        <div className="bg-[#eaf2fc] rounded-[30px] p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)] flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Elecciones Presidenciales 2026
            </h4>
            <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs rounded-full">
              Activa
            </span>
          </div>
          <BarChart3 className="text-[#0f366d]" size={64} />
        </div>
      </section>
    </div>
  );
}