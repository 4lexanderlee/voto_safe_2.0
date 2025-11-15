// src/components/layout/Sidebar.tsx
import { NavLink, useLocation } from "react-router-dom";
import { Home, Vote, Users, Building2, BarChart2, LogOut } from "lucide-react"; //FileBadge
import { ADMIN_ROUTES } from "@/router/routes";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Sidebar expandido solo en dashboard
  const isExpanded = location.pathname === ADMIN_ROUTES.DASHBOARD;

  const links = [
    { to: ADMIN_ROUTES.DASHBOARD, label: "Página Principal", icon: Home },
    { to: ADMIN_ROUTES.VOTERS, label: "Lista de Votantes", icon: Users },
    { to: ADMIN_ROUTES.STATISTICS, label: "Estadísticas", icon: BarChart2 },
    { to: ADMIN_ROUTES.ELECTIONS, label: "Gestionar Elecciones", icon: Vote },
    { to: ADMIN_ROUTES.PARTIES, label: "Gestionar Partidos", icon: Building2 },
  ];

  const handleLogout = () => {
    // Aquí irá la lógica de logout
    console.log("Logout");
    setShowLogoutModal(false);
  };

  return (
    <>
      <aside 
        className={`h-screen bg-[#0f366d] flex flex-col transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
      >
        {/* Avatar/Perfil */}
        <div className="flex items-center justify-center py-6 border-b border-blue-800">
          <div className="w-14 h-14 rounded-full bg-white overflow-hidden">
            <img 
              src="https://c0.klipartz.com/pngpicture/122/453/gratis-png-iconos-de-computadora-perfil-de-usuario-avatar-femenino-perfil-thumbnail.png" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-4 transition-all text-white hover:bg-blue-700
                  ${isActive ? "bg-blue-800 border-l-4 border-white" : ""}`
                }
              >
                <Icon size={24} className="flex-shrink-0" />
                {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-4 px-5 py-4 text-white hover:bg-red-600 transition-all border-t border-blue-800"
        >
          <LogOut size={24} className="flex-shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Salir</span>}
        </button>
      </aside>

      {/* Modal de Confirmación de Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-96 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">¿Confirmar salida?</h3>
            <p className="text-gray-600 mb-6">¿Estás seguro que deseas cerrar sesión?</p>
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
    </>
  );
}