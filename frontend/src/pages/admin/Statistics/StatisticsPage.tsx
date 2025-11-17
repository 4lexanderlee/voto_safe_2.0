// ===============================================
// File: src/pages/admin/Statistics/StatisticsPage.tsx
// ===============================================
import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, MapPin, BarChart3, PieChart as PieIcon, Users } from 'lucide-react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

// --- INTERFACES ---

// Tus usuarios en 'usuariosData'
interface UserData {
  DNI: string;
  Nombres: string;
  Apellidos: string;
  Departamento: string;
  Estado: 'voto' | 'no voto'; // La clave para saber si contar el voto
  "Elección"?: string; // A veces dice "ELECCION"
}

// Tus partidos en 'votosafe_parties'
interface Party {
  id: string;
  name: string;
  color?: string;
  logoUrl?: string;
}

const StatisticsPage = () => {
  // --- ESTADOS ---
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>(''); // '' = Nacional
  const [isDepartamentoOpen, setIsDepartamentoOpen] = useState(false);

  // --- DATOS ---
  const [users, setUsers] = useState<UserData[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  
  // Elección activa (Hardcoded visualmente ya que dijiste que es la única)
  const activeElectionName = "ELECCIONES GENERALES 2025";

  // 1. CARGAR DATOS
  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const loadData = () => {
    try {
      // Cargar usuarios (donde están los votos)
      const uData = localStorage.getItem('usuariosData');
      if (uData) setUsers(JSON.parse(uData));

      // Cargar partidos (para saber a quién asignar los votos)
      const pData = localStorage.getItem('votosafe_parties');
      if (pData) {
        setParties(JSON.parse(pData));
      } else {
        // Fallback si no hay partidos creados: Partidos falsos para que no se rompa
        setParties([
            { id: 'p1', name: 'Partido A', color: '#FF6384' },
            { id: 'p2', name: 'Partido B', color: '#36A2EB' },
            { id: 'p3', name: 'Partido C', color: '#FFCE56' }
        ]);
      }

    } catch (error) {
      console.error("Error cargando localstorage:", error);
    }
  };

  // --- LÓGICA PRINCIPAL DE CÁLCULO ---
  const stats = useMemo(() => {
    // 1. Filtrar usuarios por Departamento seleccionado
    let filteredUsers = users;
    if (selectedDepartamento) {
      filteredUsers = users.filter(u => u.Departamento === selectedDepartamento);
    }

    // 2. Calcular Participación (REAL basada en tu data)
    const totalHabilitados = filteredUsers.length;
    const usuariosQueVotaron = filteredUsers.filter(u => u.Estado === 'voto');
    const totalVotos = usuariosQueVotaron.length;
    const participacionPct = totalHabilitados > 0 ? Math.round((totalVotos / totalHabilitados) * 100) : 0;

    // 3. Calcular Distribución de Votos (SIMULADA basada en DNI)
    // Como 'usuariosData' no dice por quién votó, usamos el DNI para asignar un partido fijo.
    const results: Record<string, number> = {};
    
    // Inicializar conteo
    parties.forEach(p => results[p.id] = 0);

    usuariosQueVotaron.forEach(user => {
      if (parties.length > 0) {
        // "Truco": Usar el DNI numérico para elegir siempre el mismo índice de partido
        const dniNum = parseInt(user.DNI.replace(/\D/g, '')) || 0;
        const partyIndex = dniNum % parties.length; 
        const assignedPartyId = parties[partyIndex].id;
        results[assignedPartyId]++;
      }
    });

    // 4. Preparar Datos para Gráficos
    const chartData = parties.map(party => {
      const votes = results[party.id] || 0;
      const percentage = totalVotos > 0 ? Math.round((votes / totalVotos) * 100) : 0;
      
      // Generar color aleatorio si no tiene
      const fallbackColor = '#' + Math.floor(Math.random()*16777215).toString(16);

      return {
        id: party.id,
        name: party.name,
        votes,
        percentage,
        color: party.color || fallbackColor,
        logoUrl: party.logoUrl
      };
    }).sort((a, b) => b.percentage - a.percentage);

    return {
      totalHabilitados,
      totalVotos,
      participacionPct,
      chartData
    };

  }, [users, parties, selectedDepartamento]);


  // Extraer lista única de departamentos
  const departamentos = Array.from(new Set(users.map(u => u.Departamento))).sort();

  // Formatear datos para librerías
  const barData = stats.chartData.map(c => ({ name: c.name, percentage: c.percentage }));
  const pieData = stats.chartData.map((c, i) => ({
    id: i,
    value: c.percentage,
    label: `${c.name} (${c.percentage}%)`,
    color: c.color
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      
      {/* TITULO */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Resultados Electorales</h1>
        <p className="text-gray-500">Monitorización en tiempo real de {activeElectionName}</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-yellow-50 p-8 rounded-xl text-center border border-yellow-200 text-yellow-800">
          <h3 className="font-bold text-lg">No hay datos de usuarios</h3>
          <p>Asegúrate de haber ejecutado el script de generación de usuarios ('usuariosData').</p>
        </div>
      ) : (
        <>
            {/* TARJETAS DE RESUMEN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* PADRÓN */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-2 border-blue-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase">Padrón Electoral</p>
                        <h2 className="text-3xl font-black text-gray-800">{stats.totalHabilitados.toLocaleString()}</h2>
                        <p className="text-xs text-gray-400 mt-1">
                            {selectedDepartamento ? `En ${selectedDepartamento}` : 'Nivel Nacional'}
                        </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-full text-blue-500"><Users size={24} /></div>
                </div>

                {/* VOTOS EMITIDOS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500 border-2 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase">Votos Emitidos</p>
                        <h2 className="text-3xl font-black text-gray-800">{stats.totalVotos.toLocaleString()}</h2>
                        <p className="text-xs text-green-600 font-bold mt-1">
                            Estado: "Voto"
                        </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-full text-green-500"><PieIcon size={24} /></div>
                </div>

                {/* PARTICIPACIÓN */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-2 border-purple-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase">Participación</p>
                        <h2 className="text-3xl font-black text-gray-800">{stats.participacionPct}%</h2>
                        <div className="w-24 h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div className="bg-purple-500 h-full" style={{ width: `${stats.participacionPct}%` }}></div>
                        </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-full text-purple-500"><BarChart3 size={24} /></div>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white">
                
                {/* COLUMNA IZQUIERDA: GRÁFICOS */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* TOP CANDIDATOS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.chartData.slice(0, 4).map((c) => (
                            <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm border-2 border-blue-500 text-center">
                                <div 
                                    className="w-12 h-12 mx-auto rounded-full mb-2 flex items-center justify-center text-white font-bold text-lg"
                                    style={{ backgroundColor: c.color }}
                                >
                                    {c.logoUrl ? <img src={c.logoUrl} className="w-full h-full rounded-full object-contain"/> : c.name.substring(0,1)}
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm truncate">{c.name}</h4>
                                <p className="text-xl font-black text-gray-900">{c.percentage}%</p>
                            </div>
                        ))}
                    </div>

                    {/* BARRAS */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-700 mb-4">Resultados Generales</h3>
                        <div className="h-[300px] w-full">
                            <BarChart
                                dataset={barData}
                                yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                                series={[{ dataKey: 'percentage', valueFormatter: (v) => `${v}%`, color: '#3B82F6' }]}
                                layout="horizontal"
                                margin={{ left: 100 }}
                                borderRadius={4}
                                colors={stats.chartData.map(c => c.color)}
                                slotProps={{ legend: { hidden: true } }}
                            />
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: FILTRO Y PIE */}
                <div className="space-y-8 my-0">
                    
                    {/* FILTRO REGIONAL */}
                    <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg relative mb-10 ">
                         <MapPin className="absolute -right-4 -bottom-4 text-blue-500 opacity-50 w-32 h-32" />
                         <h3 className="font-bold text-lg mb-4 relative z-10">Filtrar por Región</h3>
                         <div className="relative z-10">
                            <button 
                                onClick={() => setIsDepartamentoOpen(!isDepartamentoOpen)}
                                className="w-full bg-white text-blue-900 font-bold py-3 px-4 rounded-xl flex justify-between items-center shadow-md"
                            >
                                {selectedDepartamento || 'Todo el País'}
                                <ChevronDown size={20} />
                            </button>
                            {isDepartamentoOpen && (
                                <div className="absolute top-full mt-2 left-0 w-full bg-white text-gray-800 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">
                                    <button 
                                        onClick={() => {setSelectedDepartamento(''); setIsDepartamentoOpen(false);}}
                                        className="w-full text-left px-4 py-2 hover:bg-blue-50 font-bold text-blue-600 border-b"
                                    >
                                        Nacional
                                    </button>
                                    {departamentos.map(dep => (
                                        <button 
                                            key={dep}
                                            onClick={() => {setSelectedDepartamento(dep); setIsDepartamentoOpen(false);}}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-0"
                                        >
                                            {dep}
                                        </button>
                                    ))}
                                </div>
                            )}
                         </div>
                    </div>

                    {/* GRÁFICO PIE */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100  flex flex-col items-center">
                        <h3 className="font-bold text-gray-700 mb-4 self-start">Distribución</h3>
                        <PieChart
                            series={[{
                                data: pieData,
                                innerRadius: 40,
                                outerRadius: 100,
                                paddingAngle: 2,
                                cornerRadius: 4,
                            }]}
                            width={300}
                            height={250}
                            slotProps={{ legend: { hidden: true } }}
                        />
                        <div className="mt-4 w-full space-y-2">
                            {stats.chartData.map(c => (
                                <div key={c.id} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></div>
                                        <span className="font-medium text-gray-600 truncate max-w-[120px]">{c.name}</span>
                                    </div>
                                    <span className="font-bold">{c.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default StatisticsPage;