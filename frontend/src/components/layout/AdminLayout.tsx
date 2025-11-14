// src/components/layout/AdminLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { UserCircle } from "lucide-react";
import { ADMIN_ROUTES } from "@/router/routes";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="h-20 bg-white flex items-center justify-end px-8 border-b border-gray-200">
          <button
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            onClick={() => navigate(ADMIN_ROUTES.BALLOTS)}
            title="Ver cédulas"
          >
            <UserCircle size={40} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-600">ADMIN</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-white p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}