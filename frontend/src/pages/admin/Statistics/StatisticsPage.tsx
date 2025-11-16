// ===============================================
// File: src/pages/admin/Statistics/StatisticsPage.tsx
// ===============================================
import { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

// Tipos
interface Election {
  id: string;
  name: string;
  type: string;
  categories: unknown[];
  startDate: string;
  endDate: string;
}

interface UserVote {
  id: string;
  userId: string;
  electionId: string;
  electionName: string;
  votes: Vote[];
  status: string;
  votedAt: string;
  createdAt: string;
}

interface Vote {
  categoryId: string;
  categoryName: string;
  partyId: string;
  partyName: string;
  candidateId: string;
  candidateName: string;
}

interface Party {
  id: string;
  name: string;
  logoUrl?: string;
  color?: string;
}

const StatisticsPage = () => {
  const [selectedElection, setSelectedElection] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [isDepartamentoOpen, setIsDepartamentoOpen] = useState(false);

  // Estados para datos dinámicos
  const [elections, setElections] = useState<Election[]>([]);
  const [allVotes, setAllVotes] = useState<UserVote[]>([]);
  const [parties, setParties] = useState<Party[]>([]);

  // Key para reiniciar animación del gráfico
  const [chartKey, setChartKey] = useState(0);

  // Cargar datos del localStorage
  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar datos cuando cambie la elección seleccionada
  useEffect(() => {
    if (selectedElection) {
      loadData();
      setChartKey(prev => prev + 1); // Reiniciar animación
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedElection]);

  const loadData = () => {
    try {
      // Cargar elecciones
      const electionsData = localStorage.getItem('votosafe_elections');
      const loadedElections = electionsData ? JSON.parse(electionsData) : [];
      setElections(loadedElections);
      
      // Seleccionar primera elección activa por defecto
      if (loadedElections.length > 0 && !selectedElection) {
        const activeElection = loadedElections.find((e: Election) => {
          const now = new Date();
          const start = new Date(e.startDate);
          const end = new Date(e.endDate);
          return now >= start && now <= end;
        });
        setSelectedElection(activeElection ? activeElection.name : loadedElections[0].name);
      }

      // Cargar votos
      const votesData = localStorage.getItem('votosafe_votes');
      const loadedVotes = votesData ? JSON.parse(votesData) : [];
      setAllVotes(loadedVotes);

      // Cargar partidos
      const partiesData = localStorage.getItem('votosafe_parties');
      const loadedParties = partiesData ? JSON.parse(partiesData) : [];
      setParties(loadedParties);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    }
  };

  // Obtener elección actual
  const getCurrentElection = () => {
    return elections.find(e => e.name === selectedElection);
  };

  // Generar colores únicos para cada partido
  const generateUniqueColors = (count: number) => {
    const baseColors = [
      '#8B5CF6', '#10B981', '#EF4444', '#F59E0B', '#3B82F6', 
      '#EC4899', '#14B8A6', '#F97316', '#A855F7', '#22C55E',
      '#EAB308', '#06B6D4', '#F43F5E', '#84CC16', '#8B5CF6'
    ];
    
    // Si hay más partidos que colores base, generar colores adicionales
    if (count > baseColors.length) {
      for (let i = baseColors.length; i < count; i++) {
        const hue = (i * 137.508) % 360; // Proporción áurea para distribución uniforme
        baseColors.push(`hsl(${hue}, 65%, 55%)`);
      }
    }
    
    return baseColors.slice(0, count);
  };

  // Calcular estadísticas de la elección actual
  const calculateElectionStats = () => {
    const election = getCurrentElection();
    if (!election) return null;

    // Filtrar votos de esta elección
    const electionVotes = allVotes.filter(v => v.electionId === election.id);
    
    // Contar votos por partido y guardar nombres de candidatos
    const partyVotes: Record<string, number> = {};
    const partyNames: Record<string, string> = {};
    const candidateNames: Record<string, string> = {};
    
    electionVotes.forEach(userVote => {
      userVote.votes.forEach(vote => {
        if (!partyVotes[vote.partyId]) {
          partyVotes[vote.partyId] = 0;
          partyNames[vote.partyId] = vote.partyName;
          candidateNames[vote.partyId] = vote.candidateName; // Guardar nombre del candidato
        }
        partyVotes[vote.partyId]++;
      });
    });

    // Calcular totales
    const totalVotes = Object.values(partyVotes).reduce((a, b) => a + b, 0);
    
    // Generar colores únicos
    const uniqueColors = generateUniqueColors(Object.keys(partyVotes).length);
    
    // Crear array de candidatos con porcentajes
    const candidatesData = Object.entries(partyVotes).map(([partyId, votes], index) => {
      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
      
      const party = parties.find(p => p.id === partyId);
      const logoUrl = party?.logoUrl || '';
      
      // Usar color del partido si existe, sino usar color único generado
      const color = party?.color || uniqueColors[index];
      
      return {
        partyId,
        name: partyNames[partyId],
        candidateName: candidateNames[partyId], // Agregar nombre del candidato
        votes,
        percentage,
        color: color,
        logoUrl: logoUrl,
      };
    }).sort((a, b) => b.percentage - a.percentage);

    return {
      candidates: candidatesData,
      totalVotes: electionVotes.length,
      totalVotesCount: totalVotes,
    };
  };

  const stats = calculateElectionStats();

  // Preparar datos para MUI PieChart
  const pieChartData = stats?.candidates.map((candidate, index) => ({
    id: index,
    value: candidate.percentage,
    label: `${candidate.name} - ${candidate.percentage}%`,
    color: candidate.color,
  })) || [];

  // Preparar datos para MUI BarChart
  const barChartData = stats?.candidates.map((candidate) => ({
    name: candidate.name,
    percentage: candidate.percentage,
  })) || [];

  const departamentos = [
    'Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura', 
    'Lambayeque', 'Junín', 'Puno', 'Cajamarca', 'Ica'
  ];

  // Estadísticas regionales simuladas
  const regionalStats = {
    habitantes: 47245,
    participacion: 88,
    votosBlanco: 263
  };

  const regionalData = stats?.candidates.slice(0, 4).map((c) => ({
    name: c.name.split(' ').slice(0, 2).join('\n'),
    percentage: c.percentage,
    color: c.color,
    logoUrl: c.logoUrl,
    height: (c.percentage / 100) * 280
  })) || [];

  // Verificar si la elección está por comenzar
  const isElectionPending = () => {
    const election = getCurrentElection();
    if (!election) return false;
    const now = new Date();
    const start = new Date(election.startDate);
    return now < start;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">ESTADISTICAS</h1>
      </div>

      <div className="mb-8">
        <label className="block text-lg font-normal text-gray-800 mb-4">
          Selecciona una de las Elecciones
        </label>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white border border-gray-300 rounded-full px-10 py-4 flex items-center justify-between hover:border-gray-400 transition shadow-sm min-w-[350px]"
          >
            <span className="font-medium text-gray-700 text-base">
              {selectedElection || 'SELECCIONAR'}
            </span>
            <ChevronDown className={`ml-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} size={22} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[350px]">
              {elections.length === 0 ? (
                <div className="px-10 py-4 text-gray-500">No hay elecciones disponibles</div>
              ) : (
                elections.map((election) => (
                  <button
                    key={election.id}
                    onClick={() => {
                      setSelectedElection(election.name);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-10 py-4 text-left hover:bg-gray-50 transition first:rounded-t-lg last:rounded-b-lg font-medium text-gray-700 text-base"
                  >
                    {election.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-10">
        {isElectionPending() ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-400 rounded-3xl p-16 shadow-2xl">
                <h2 className="text-5xl font-bold text-gray-800 mb-6">
                  {selectedElection}
                </h2>
                <div className="bg-yellow-400 text-gray-900 font-black text-3xl py-8 px-12 rounded-2xl shadow-lg">
                  ESTAS ELECCIONES ESTÁN POR COMENZAR
                </div>
              </div>
            </div>
          </div>
        ) : !stats || stats.candidates.length === 0 ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-4 border-blue-400 rounded-3xl p-16 shadow-2xl">
                <h2 className="text-5xl font-bold text-gray-800 mb-6">
                  {selectedElection}
                </h2>
                <div className="bg-blue-400 text-white font-black text-3xl py-8 px-12 rounded-2xl shadow-lg">
                  AÚN NO HAY VOTOS REGISTRADOS
                </div>
                <p className="text-gray-600 mt-6 text-lg">
                  Los gráficos aparecerán cuando los usuarios comiencen a votar
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                {selectedElection}
              </h2>
              <div className="grid grid-cols-4 gap-8">
                {stats.candidates.slice(0, 4).map((candidate) => {
                  return (
                    <div key={candidate.partyId} className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center">
                      <div 
                        className="w-32 h-32 rounded-2xl flex items-center justify-center mb-4 shadow-md overflow-hidden"
                        style={{ backgroundColor: candidate.logoUrl && candidate.logoUrl.trim() !== '' ? 'white' : candidate.color }}
                      >
                        {candidate.logoUrl && candidate.logoUrl.trim() !== '' ? (
                          <img 
                            src={candidate.logoUrl} 
                            alt={candidate.name}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              if (target.parentElement) {
                                target.parentElement.style.backgroundColor = candidate.color;
                                target.parentElement.innerHTML = `<div class="text-white font-black text-5xl">${candidate.name.charAt(0)}</div>`;
                              }
                            }}
                          />
                        ) : (
                          <div className="text-white font-black text-5xl">
                            {candidate.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-base text-center">{candidate.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 text-center">{candidate.candidateName}</p>
                      <p className="text-4xl font-bold text-gray-900">{candidate.percentage}%</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-md">
                <h3 className="text-base font-bold text-gray-800 mb-8 text-center uppercase">
                  Diagrama de Barras Horizontal
                </h3>
                <div className="w-full flex justify-center">
                  <BarChart
                    key={chartKey}
                    dataset={barChartData}
                    yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                    series={stats.candidates.map((candidate, index) => ({
                      dataKey: 'percentage',
                      label: candidate.name,
                      valueFormatter: (value: number | null) => value ? `${value}%` : '0%',
                      color: candidate.color,
                      id: `series-${index}`,
                    }))}
                    xAxis={[{ 
                      label: 'Porcentaje (%)',
                      min: 0,
                      max: 100,
                    }]}
                    layout="horizontal"
                    height={Math.max(400, stats.candidates.length * 80)}
                    margin={{ left: 150, right: 30, top: 30, bottom: 60 }}
                    colors={stats.candidates.map(c => c.color)}
                    slotProps={{
                      legend: { hidden: true },
                    }}
                    sx={{
                      '& .MuiChartsAxis-tickLabel': {
                        fontSize: 13,
                        fontWeight: 600,
                        fill: '#374151',
                      },
                      '& .MuiChartsAxis-label': {
                        fontSize: 14,
                        fontWeight: 700,
                        fill: '#374151',
                      },
                    }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-md">
                <h3 className="text-base font-bold text-gray-800 mb-8 text-center uppercase">
                  Diagrama Circular
                </h3>
                <div className="flex items-center justify-center">
                  <PieChart
                    key={chartKey}
                    series={[
                      {
                        data: pieChartData,
                        arcLabel: (item) => `${item.value}%`,
                        highlightScope: { faded: 'none', highlighted: 'item' },
                      }
                    ]}
                    width={600}
                    height={400}
                    colors={pieChartData.map(d => d.color)}
                    slotProps={{
                      legend: { 
                        direction: 'column',
                        position: { vertical: 'middle', horizontal: 'right' },
                        padding: 0,
                        itemMarkWidth: 15,
                        itemMarkHeight: 15,
                        markGap: 8,
                        itemGap: 12,
                        labelStyle: {
                          fontSize: 13,
                          fontWeight: 600,
                          fill: '#374151',
                        }
                      },
                    }}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      },
                      [`& .${pieArcLabelClasses.root}.${pieArcLabelClasses.animate}`]: {
                        animationDuration: '1.5s',
                      },
                      '& .MuiPieArc-root': {
                        stroke: 'white',
                        strokeWidth: 2,
                        transition: 'all 0.3s ease',
                      },
                      '& .MuiPieArc-root:hover': {
                        filter: 'brightness(1.1)',
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-md">
              <h3 className="text-base font-bold text-gray-800 mb-8 uppercase">
                Votos por Región a Nivel Nacional
              </h3>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold italic w-40">
                      SELECCIONA EL<br/>DEPARTAMENTO
                    </label>
                    <div className="flex-1 relative">
                      <button 
                        onClick={() => setIsDepartamentoOpen(!isDepartamentoOpen)}
                        className="w-full bg-white border border-gray-300 rounded-full px-6 py-3 flex items-center justify-between text-sm hover:border-gray-400 shadow-sm"
                      >
                        <span className="font-medium">{selectedDepartamento || 'SELECCIONAR'}</span>
                        <ChevronDown size={18} className={`transition-transform ${isDepartamentoOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isDepartamentoOpen && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                          {departamentos.map((dep) => (
                            <button
                              key={dep}
                              onClick={() => {
                                setSelectedDepartamento(dep);
                                setIsDepartamentoOpen(false);
                              }}
                              className="w-full px-6 py-3 text-left text-sm hover:bg-gray-100 font-medium"
                            >
                              {dep}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 space-y-4 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase border-b pb-2">
                      Información Regional
                    </h4>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-semibold text-gray-700">TOTAL DE HABITANTES</span>
                      <span className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full px-6 py-2 text-sm font-bold text-gray-800">
                        {regionalStats.habitantes.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-semibold text-gray-700">TASA DE PARTICIPACIÓN</span>
                      <span className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-full px-6 py-2 text-sm font-bold text-gray-800">
                        {regionalStats.participacion}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-semibold text-gray-700">VOTOS EN BLANCO</span>
                      <span className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-full px-6 py-2 text-sm font-bold text-gray-800">
                        {regionalStats.votosBlanco}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <MapPin size={22} className="text-gray-600" />
                    <span className="text-base font-semibold text-gray-800">
                      {selectedDepartamento ? selectedDepartamento.toUpperCase() : 'LIMA'}
                    </span>
                  </div>

                  <div className="flex items-end justify-around h-96 pb-6 px-6">
                    {regionalData.map((candidate, index) => (
                      <div key={index} className="flex flex-col items-center gap-3 relative">
                        <div 
                          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                          style={{
                            width: '90px',
                            height: '15px',
                            background: 'radial-gradient(ellipse, rgba(0,0,0,0.2), transparent)',
                            borderRadius: '50%'
                          }}
                        ></div>
                        
                        <div className="relative" style={{ height: `${candidate.height}px`, width: '80px' }}>
                          <div 
                            className="absolute bottom-0 left-0 w-full h-full rounded-t-2xl flex items-center justify-center"
                            style={{ 
                              background: `linear-gradient(180deg, ${candidate.color} 0%, ${candidate.color}ee 50%, ${candidate.color}cc 100%)`,
                              boxShadow: `6px 0 20px rgba(0,0,0,0.3), inset -4px 0 10px rgba(0,0,0,0.2)`
                            }}
                          >
                            {candidate.logoUrl && candidate.logoUrl.trim() !== '' && (
                              <img 
                                src={candidate.logoUrl} 
                                alt={candidate.name}
                                className="w-12 h-12 object-contain opacity-30"
                              />
                            )}
                            <div 
                              className="absolute top-0 left-3 rounded-t-lg"
                              style={{ 
                                width: '12px',
                                height: `${candidate.height * 0.6}px`,
                                background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
                                opacity: 0.7
                              }}
                            ></div>
                          </div>
                          
                          <div 
                            className="absolute -top-4 left-0 rounded-t-2xl"
                            style={{ 
                              width: '80px',
                              height: '24px',
                              background: `linear-gradient(135deg, ${candidate.color} 30%, ${candidate.color}ee 100%)`,
                              transform: 'perspective(200px) rotateX(65deg)',
                              transformOrigin: 'bottom center',
                              boxShadow: '0 -6px 15px rgba(0,0,0,0.25)',
                              borderRadius: '12px 12px 0 0'
                            }}
                          ></div>
                          
                          <div 
                            className="absolute bottom-0 -right-5"
                            style={{ 
                              width: '20px',
                              height: `${candidate.height}px`,
                              background: `linear-gradient(to bottom, ${candidate.color}dd 0%, ${candidate.color}99 50%, ${candidate.color}77 100%)`,
                              clipPath: 'polygon(0 4%, 100% 0, 100% 96%, 0 100%)',
                              boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.4)'
                            }}
                          ></div>
                        </div>
                        
                        <div className="text-center mt-3">
                          <p className="text-3xl font-bold text-gray-900 mb-2">{candidate.percentage}%</p>
                          <p className="text-sm font-semibold text-gray-700 leading-tight whitespace-pre-line">{candidate.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;