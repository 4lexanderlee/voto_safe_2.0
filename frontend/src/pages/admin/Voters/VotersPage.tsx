// ===============================================
// File: src/pages/admin/Voters/VotersPage.tsx
// ===============================================
// src/pages/admin/Voters/VotersPage.tsx
import { useState, useEffect } from 'react';
import { Search, Filter, Download, Users } from 'lucide-react';

// Tipos
interface Voter {
  dni: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  userType: 'Admin' | 'User' | 'PPMM';
  department: string;
  hasVoted: boolean;
  electionName?: string;
  registeredAt: string;
}

const VotersPage = () => {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filteredVoters, setFilteredVoters] = useState<Voter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUserType, setFilterUserType] = useState<string>('all');
  const [filterVoteStatus, setFilterVoteStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // Generar 1000 usuarios de ejemplo
  useEffect(() => {
    const generatedVoters = generateVoters(1000);
    setVoters(generatedVoters);
    setFilteredVoters(generatedVoters);
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...voters];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (v) =>
          v.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterUserType !== 'all') {
      filtered = filtered.filter((v) => v.userType === filterUserType);
    }

    if (filterVoteStatus === 'voted') {
      filtered = filtered.filter((v) => v.hasVoted);
    } else if (filterVoteStatus === 'not-voted') {
      filtered = filtered.filter((v) => !v.hasVoted);
    }

    if (filterDepartment !== 'all') {
      filtered = filtered.filter((v) => v.department === filterDepartment);
    }

    setFilteredVoters(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterUserType, filterVoteStatus, filterDepartment, voters]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredVoters.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVoters = filteredVoters.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Función para generar usuarios - SOLO 1 ADMIN
  const generateVoters = (count: number): Voter[] => {
    const firstNames = [
      'Alexander', 'Alejandro', 'Kevin', 'Yermin', 'Aldair', 'Ximena',
      'Valeria', 'Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen',
      'Jorge', 'Rosa', 'Pedro', 'Isabel', 'Miguel', 'Patricia', 'Juan',
      'Laura', 'Diego', 'Sofía', 'Fernando', 'Lucía', 'Ricardo', 'Elena',
      'Roberto', 'Gabriela', 'Andrés', 'Daniela', 'Manuel', 'Victoria',
      'Pablo', 'Camila', 'Javier', 'Natalia', 'Raúl', 'Andrea', 'Sergio'
    ];

    const lastNames = [
      'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez',
      'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez',
      'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Romero',
      'Hernández', 'Jiménez', 'Ruiz', 'Mendoza', 'Vargas', 'Castillo',
      'Castro', 'Ramos', 'Campos', 'Vega', 'Medina', 'Rojas', 'Silva'
    ];

    const departments = [
      'Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura',
      'Lambayeque', 'Junín', 'Puno', 'Cajamarca', 'Ica'
    ];

    const userTypes: ('User' | 'PPMM')[] = ['User', 'PPMM'];

    const elections = [
      'ELECCIONES PRESIDENCIALES 2025',
      'ELECCIONES REGIONALES 2025',
      'ELECCIONES MUNICIPALES 2025'
    ];

    const generatedVoters: Voter[] = [];

    // Determinar aleatoriamente en qué posición irá el único Admin
    const adminPosition = Math.floor(Math.random() * count);

    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = `${lastNames[Math.floor(Math.random() * lastNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      const dni = String(10000000 + i).padStart(8, '0');
      const year = 1960 + Math.floor(Math.random() * 45);
      const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
      const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
      const birthDate = `${year}-${month}-${day}`;
      
      // Solo en la posición aleatoria del Admin, asignar 'Admin', el resto User o PPMM
      const userType = i === adminPosition 
        ? 'Admin' 
        : userTypes[Math.floor(Math.random() * userTypes.length)];
      
      const department = departments[Math.floor(Math.random() * departments.length)];
      const hasVoted = Math.random() > 0.4;
      const electionName = hasVoted ? elections[Math.floor(Math.random() * elections.length)] : undefined;
      
      const regYear = 2024;
      const regMonth = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
      const regDay = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
      const registeredAt = `${regYear}-${regMonth}-${regDay}`;

      generatedVoters.push({
        dni,
        firstName,
        lastName,
        birthDate,
        userType,
        department,
        hasVoted,
        electionName,
        registeredAt,
      });
    }

    return generatedVoters;
  };

  // Exportar a CSV
  const handleExportCSV = () => {
    const headers = ['DNI', 'Nombres', 'Apellidos', 'Fecha Nacimiento', 'Tipo Usuario', 'Departamento', 'Ha Votado', 'Elección', 'Registrado'];
    const csvContent = [
      headers.join(','),
      ...filteredVoters.map((v) =>
        [
          v.dni,
          v.firstName,
          v.lastName,
          v.birthDate,
          v.userType,
          v.department,
          v.hasVoted ? 'Sí' : 'No',
          v.electionName || 'N/A',
          v.registeredAt,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `votantes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Estadísticas
  const stats = {
    total: voters.length,
    voted: voters.filter((v) => v.hasVoted).length,
    notVoted: voters.filter((v) => !v.hasVoted).length,
    admins: voters.filter((v) => v.userType === 'Admin').length,
    users: voters.filter((v) => v.userType === 'User').length,
    ppmm: voters.filter((v) => v.userType === 'PPMM').length,
  };

  const departments = ['Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura', 'Lambayeque', 'Junín', 'Puno', 'Cajamarca', 'Ica'];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Lista de Usuarios Votantes
            </h1>
            <p className="text-gray-600">Gestiona y visualiza todos los votantes registrados</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            <Download size={20} />
            Exportar CSV
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users size={20} />
              <span className="text-sm font-medium opacity-90">Total</span>
            </div>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium opacity-90">Votaron</span>
            </div>
            <p className="text-3xl font-bold">{stats.voted}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium opacity-90">No Votaron</span>
            </div>
            <p className="text-3xl font-bold">{stats.notVoted}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium opacity-90">Admins</span>
            </div>
            <p className="text-3xl font-bold">{stats.admins}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium opacity-90">Users</span>
            </div>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium opacity-90">PPMM</span>
            </div>
            <p className="text-3xl font-bold">{stats.ppmm}</p>
          </div>
        </div>

        {/* Búsqueda y Filtros */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por DNI, nombre o apellido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter size={20} />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Usuario
                </label>
                <select
                  value={filterUserType}
                  onChange={(e) => setFilterUserType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                  <option value="PPMM">PPMM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Voto
                </label>
                <select
                  value={filterVoteStatus}
                  onChange={(e) => setFilterVoteStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="voted">Votaron</option>
                  <option value="not-voted">No Votaron</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento
                </label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos</option>
                  {departments.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Nombres
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Apellidos
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Fecha Nac.
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Elección
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentVoters.map((voter) => (
                <tr key={voter.dni} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {voter.dni}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {voter.firstName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {voter.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(voter.birthDate).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        voter.userType === 'Admin'
                          ? 'bg-purple-100 text-purple-800'
                          : voter.userType === 'PPMM'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {voter.userType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {voter.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        voter.hasVoted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {voter.hasVoted ? 'Votó' : 'No votó'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {voter.electionName || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer con paginación */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-semibold">{startIndex + 1}</span> a{' '}
              <span className="font-semibold">{Math.min(endIndex, filteredVoters.length)}</span> de{' '}
              <span className="font-semibold">{filteredVoters.length}</span> votantes
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Anterior
              </button>
              
              <span className="text-sm text-gray-700 px-4">
                Página <span className="font-semibold">{currentPage}</span> de{' '}
                <span className="font-semibold">{totalPages}</span>
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotersPage;