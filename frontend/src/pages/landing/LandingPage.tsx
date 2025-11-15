// src/pages/landing/LandingPage.tsx

import { useNavigate } from "react-router-dom";
import { Vote, Shield, Users, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f366d] to-[#1e5a9e]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Vote size={32} className="text-white" />
          <h1 className="text-2xl font-bold text-white">Voto Safe 2.0</h1>
        </div>
        <button
          onClick={() => navigate("/auth/login")}
          className="bg-white text-[#0f366d] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Iniciar Sesión
        </button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Sistema de Votación Digital Seguro
          </h2>
          <p className="text-xl text-gray-200 mb-12">
            Participa en elecciones de forma transparente, segura y confiable desde cualquier lugar
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-20">
            <button
              onClick={() => navigate("/auth/register")}
              className="bg-white text-[#0f366d] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              Registrarse
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate("/auth/login")}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[#0f366d] transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <Shield size={48} className="text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Seguridad Garantizada
              </h3>
              <p className="text-gray-200">
                Tu voto está protegido con los más altos estándares de seguridad
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <Vote size={48} className="text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Fácil y Rápido
              </h3>
              <p className="text-gray-200">
                Vota en segundos desde cualquier dispositivo con internet
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <Users size={48} className="text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Transparente
              </h3>
              <p className="text-gray-200">
                Seguimiento en tiempo real de tus elecciones disponibles
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}