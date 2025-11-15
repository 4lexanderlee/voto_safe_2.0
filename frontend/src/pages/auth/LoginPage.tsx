// src/pages/auth/LoginPage.tsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, User, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    dni: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    if (isAdmin()) {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/ballots");
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.dni.trim() || !formData.password.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    const result = login(formData.dni, formData.password);
    
    if (result.success) {
      // El hook useAuth ya actualiza el estado
      // La redirección se hará automáticamente por el useEffect
      setTimeout(() => {
        if (isAdmin()) {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/ballots");
        }
      }, 100);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f366d] to-[#1e5a9e] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0f366d] rounded-full mb-4">
            <LogIn size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Voto Safe 2.0
          </h1>
          <p className="text-gray-600">Inicia sesión para continuar</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DNI Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DNI
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                placeholder="Ingresa tu DNI"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
                maxLength={8}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Ingresa tu contraseña"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-[#0f366d]"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#0f366d] text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/auth/register"
              className="text-[#0f366d] font-semibold hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-600 text-center mb-2">
            <strong>Credenciales de prueba:</strong>
          </p>
          <p className="text-xs text-gray-600 text-center">
            Admin: DNI <strong>72381395</strong> / Pass: <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}