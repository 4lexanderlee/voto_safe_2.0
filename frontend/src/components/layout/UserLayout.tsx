// src/components/layout/UserLayout.tsx

import { Outlet, useNavigate } from "react-router-dom";
import { Vote, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function UserLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/user");
  };

  if (!user) {
    navigate("/user");
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#0f366d] text-white">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Vote size={32} />
            <h1 className="text-2xl font-bold">Voto Safe 2.0</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm opacity-80">Bienvenido(a)</p>
              <p className="font-semibold">{user.fullName}</p>
            </div>
            
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <LogOut size={20} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Modal de Confirmación de Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-96 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              ¿Confirmar salida?
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro que deseas cerrar sesión?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}