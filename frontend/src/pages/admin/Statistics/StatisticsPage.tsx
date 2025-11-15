// ===============================================
// File: src/pages/admin/Statistics/StatisticsPage.tsx
// ===============================================
import { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

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
  logo?: string;
  color?: string;
}

const StatisticsPage = () => {
  const [selectedElection, setSelectedElection] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const [isDepartamentoOpen, setIsDepartamentoOpen] = useState(false);
  const [isProvinciaOpen, setIsProvinciaOpen] = useState(false);
  const [isDistritoOpen, setIsDistritoOpen] = useState(false);

  // Estados para datos dinámicos
  const [elections, setElections] = useState<Election[]>([]);
  const [allVotes, setAllVotes] = useState<UserVote[]>([]);
  const [parties, setParties] = useState<Party[]>([]);

  // Cargar datos del localStorage
  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      console.error('Error cargando datos:', error);
    }
  };

  // Obtener elección actual
  const getCurrentElection = () => {
    return elections.find(e => e.name === selectedElection);
  };

  // Calcular estadísticas de la elección actual
  const calculateElectionStats = () => {
    const election = getCurrentElection();
    if (!election) return null;

    // Filtrar votos de esta elección
    const electionVotes = allVotes.filter(v => v.electionId === election.id);
    
    // Contar votos por partido
    const partyVotes: Record<string, number> = {};
    const partyNames: Record<string, string> = {};
    
    electionVotes.forEach(userVote => {
      userVote.votes.forEach(vote => {
        if (!partyVotes[vote.partyId]) {
          partyVotes[vote.partyId] = 0;
          partyNames[vote.partyId] = vote.partyName;
        }
        partyVotes[vote.partyId]++;
      });
    });

    // Calcular totales
    const totalVotes = Object.values(partyVotes).reduce((a, b) => a + b, 0);
    
    // Crear array de candidatos con porcentajes
    const candidatesData = Object.entries(partyVotes).map(([partyId, votes]) => {
      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
      const party = parties.find(p => p.id === partyId);
      return {
        partyId,
        name: partyNames[partyId],
        votes,
        percentage,
        color: party?.color || getRandomColor(),
      };
    }).sort((a, b) => b.percentage - a.percentage);

    return {
      candidates: candidatesData,
      totalVotes: electionVotes.length,
      totalVotesCount: totalVotes,
    };
  };

  const getRandomColor = () => {
    const colors = ['#8B5CF6', '#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const stats = calculateElectionStats();

  const departamentos = [
    'Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura', 
    'Lambayeque', 'Junín', 'Puno', 'Cajamarca', 'Ica'
  ];

  const provincias = {
    'Lima': ['Lima', 'Barranca', 'Cañete', 'Huaral'],
    'Arequipa': ['Arequipa', 'Camaná', 'Caravelí'],
    'Cusco': ['Cusco', 'Acomayo', 'Anta', 'Calca']
  };

  const distritos = {
    'Lima': ['San Juan de Lurigancho', 'Miraflores', 'San Borja', 'Surco'],
    'Arequipa': ['Arequipa', 'Cayma', 'Cerro Colorado'],
    'Cusco': ['Cusco', 'San Jerónimo', 'San Sebastián']
  };

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
                {stats.candidates.slice(0, 4).map((candidate) => (
                  <div key={candidate.partyId} className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center">
                    <div 
                      className="w-32 h-32 rounded-2xl flex items-center justify-center mb-4 shadow-md"
                      style={{ backgroundColor: candidate.color }}
                    >
                      <div className="text-white font-black text-5xl">
                        {candidate.name.charAt(0)}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 text-base text-center">{candidate.name}</h3>
                    <p className="text-4xl font-bold text-gray-900">{candidate.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-md">
                <h3 className="text-base font-bold text-gray-800 mb-8 text-center uppercase">
                  Diagrama de Barras Horizontal
                </h3>
                <div className="space-y-6">
                  {stats.candidates.map((candidate) => (
                    <div key={candidate.partyId} className="flex items-center gap-4">
                      <div className="w-20 text-xs font-semibold text-gray-700 text-right leading-tight">
                        {candidate.name}
                      </div>
                      <div className="flex-1 relative">
                        <div className="bg-gray-100 rounded h-10"></div>
                        <div 
                          className="absolute top-0 left-0 h-10 rounded transition-all duration-500" 
                          style={{ 
                            width: `${candidate.percentage}%`,
                            backgroundColor: candidate.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-6 text-xs text-gray-600 font-medium ml-24">
                  <span>20%</span>
                  <span>40%</span>
                  <span>60%</span>
                  <span>80%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-md">
                <h3 className="text-base font-bold text-gray-800 mb-8 text-center uppercase">
                  Diagrama Circular
                </h3>
                <div className="flex items-center justify-center gap-12">
                  <div className="relative w-64 h-64">
                    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                      {(() => {
                        let currentAngle = 0;
                        return stats.candidates.map((candidate) => {
                          const startAngle = currentAngle;
                          const angleSize = (candidate.percentage / 100) * 360;
                          currentAngle += angleSize;
                          
                          const startRad = (startAngle * Math.PI) / 180;
                          const endRad = (currentAngle * Math.PI) / 180;
                          
                          const x1 = 50 + 40 * Math.cos(startRad);
                          const y1 = 50 + 40 * Math.sin(startRad);
                          const x2 = 50 + 40 * Math.cos(endRad);
                          const y2 = 50 + 40 * Math.sin(endRad);
                          
                          const largeArc = angleSize > 180 ? 1 : 0;
                          
                          return (
                            <path
                              key={candidate.partyId}
                              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill={candidate.color}
                              className="transition-all cursor-pointer"
                              style={{ opacity: hoveredSection === candidate.partyId ? 0.8 : 1 }}
                              onMouseEnter={() => setHoveredSection(candidate.partyId)}
                              onMouseLeave={() => setHoveredSection(null)}
                            />
                          );
                        });
                      })()}
                    </svg>
                    
                    {hoveredSection && (() => {
                      const candidate = stats.candidates.find(c => c.partyId === hoveredSection);
                      if (!candidate) return null;
                      
                      return (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
                          <div 
                            className="text-white font-bold text-lg px-4 py-2 rounded-lg shadow-xl border-2 border-white whitespace-nowrap"
                            style={{ backgroundColor: candidate.color }}
                          >
                            {candidate.name} - {candidate.percentage}%
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 mb-6 text-sm uppercase">Leyenda</h4>
                    {stats.candidates.map((candidate) => (
                      <div key={candidate.partyId} className="flex items-center gap-3">
                        <div 
                          className="w-10 h-6 rounded shadow-sm" 
                          style={{ backgroundColor: candidate.color }}
                        ></div>
                        <span className="text-sm font-semibold text-gray-700 uppercase">
                          {candidate.name} - {candidate.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-md">
              <h3 className="text-base font-bold text-gray-800 mb-8 uppercase">
                Votos por Región a Nivel Nacional
              </h3>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <label className="text-xs font-semibold italic w-32">
                      SELECCIONA EL<br/>DEPARTAMENTO
                    </label>
                    <div className="flex-1 relative">
                      <button 
                        onClick={() => setIsDepartamentoOpen(!isDepartamentoOpen)}
                        className="w-full bg-white border border-gray-300 rounded-full px-4 py-2 flex items-center justify-between text-xs hover:border-gray-400"
                      >
                        <span>{selectedDepartamento || 'SELECCIONAR'}</span>
                        <ChevronDown size={16} className={`transition-transform ${isDepartamentoOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isDepartamentoOpen && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                          {departamentos.map((dep) => (
                            <button
                              key={dep}
                              onClick={() => {
                                setSelectedDepartamento(dep);
                                setIsDepartamentoOpen(false);
                                setSelectedProvincia('');
                                setSelectedDistrito('');
                              }}
                              className="w-full px-4 py-2 text-left text-xs hover:bg-gray-100"
                            >
                              {dep}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-xs font-semibold italic w-32">
                      SELECCIONA LA<br/>PROVINCIA
                    </label>
                    <div className="flex-1 relative">
                      <button 
                        onClick={() => selectedDepartamento && setIsProvinciaOpen(!isProvinciaOpen)}
                        disabled={!selectedDepartamento}
                        className="w-full bg-white border border-gray-300 rounded-full px-4 py-2 flex items-center justify-between text-xs hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>{selectedProvincia || 'SELECCIONAR'}</span>
                        <ChevronDown size={16} className={`transition-transform ${isProvinciaOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isProvinciaOpen && selectedDepartamento && provincias[selectedDepartamento] && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                          {provincias[selectedDepartamento].map((prov) => (
                            <button
                              key={prov}
                              onClick={() => {
                                setSelectedProvincia(prov);
                                setIsProvinciaOpen(false);
                                setSelectedDistrito('');
                              }}
                              className="w-full px-4 py-2 text-left text-xs hover:bg-gray-100"
                            >
                              {prov}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-xs font-semibold italic w-32">
                      SELECCIONA EL<br/>DISTRITO
                    </label>
                    <div className="flex-1 relative">
                      <button 
                        onClick={() => selectedProvincia && setIsDistritoOpen(!isDistritoOpen)}
                        disabled={!selectedProvincia}
                        className="w-full bg-white border border-gray-300 rounded-full px-4 py-2 flex items-center justify-between text-xs hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>{selectedDistrito || 'SELECCIONAR'}</span>
                        <ChevronDown size={16} className={`transition-transform ${isDistritoOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isDistritoOpen && selectedProvincia && distritos[selectedProvincia] && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                          {distritos[selectedProvincia].map((dist) => (
                            <button
                              key={dist}
                              onClick={() => {
                                setSelectedDistrito(dist);
                                setIsDistritoOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left text-xs hover:bg-gray-100"
                            >
                              {dist}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs italic uppercase">TOTAL DE<br/>HABITANTES</span>
                      <span className="bg-white rounded-full px-6 py-2 text-xs font-bold">{regionalStats.habitantes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs italic uppercase">TASA DE<br/>PARTICIPACIÓN</span>
                      <span className="bg-white rounded-full px-6 py-2 text-xs font-bold">{regionalStats.participacion}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs italic uppercase">VOTOS EN<br/>BLANCO</span>
                      <span className="bg-white rounded-full px-6 py-2 text-xs font-bold">{regionalStats.votosBlanco}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <MapPin size={22} className="text-gray-600" />
                    <span className="text-base font-semibold">
                      {selectedDepartamento && selectedProvincia && selectedDistrito 
                        ? `${selectedDepartamento.toUpperCase()}, ${selectedProvincia.toUpperCase()}, ${selectedDistrito.toUpperCase()}`
                        : 'LIMA, LIMA, SJL'}
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
                            className="absolute bottom-0 left-0 w-full h-full rounded-t-2xl"
                            style={{ 
                              background: `linear-gradient(180deg, ${candidate.color} 0%, ${candidate.color}ee 50%, ${candidate.color}cc 100%)`,
                              boxShadow: `6px 0 20px rgba(0,0,0,0.3), inset -4px 0 10px rgba(0,0,0,0.2)`
                            }}
                          >
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