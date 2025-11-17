// src/pages/user/ElectionSelectorPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, ChevronRight, Lock, Vote, UserCircle } from 'lucide-react';

// --- INTERFACES ---
interface UserData {
  DNI: string;
  Nombres: string;
  Apellidos: string;
  Estado: string; // 'voto' | 'no voto'
}

interface Election {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
}

const ElectionSelectorPage = () => {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [elections, setElections] = useState<Election[]>([]);
  
  // Estado para saber si el usuario ya votó (leído desde usuariosData)
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // 1. Cargar Usuario de Sesión (usuarioActual)
    const sessionData = localStorage.getItem('usuarioActual');
    if (!sessionData) {
      navigate('/');
      return;
    }
    const sessionUser = JSON.parse(sessionData);
    setCurrentUser(sessionUser);

    // 2. Cargar Elecciones
    const storedElections = localStorage.getItem('votosafe_elections');
    if (storedElections) {
      setElections(JSON.parse(storedElections));
    }

    // 3. VERIFICAR SI YA VOTÓ (Mirando la fuente de verdad: usuariosData)
    const usuariosDataRaw = localStorage.getItem('usuariosData');
    if (usuariosDataRaw) {
      const allUsers = JSON.parse(usuariosDataRaw);
      // Buscamos al usuario en la lista maestra por su DNI para ver su Estado actualizado
      const foundUserInMasterList = allUsers.find((u: any) => u.DNI === sessionUser.DNI);
      
      if (foundUserInMasterList && foundUserInMasterList.Estado === 'voto') {
        setHasVoted(true);
      } else {
        setHasVoted(false);
      }
    }
  }, [navigate]);

  // Validar fechas de elección
  const isElectionActive = (election: Election) => {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);
    end.setHours(23, 59, 59); // Final del día
    return now >= start && now <= end && election.status === 'active';
  };

  const handleSelectElection = (election: Election) => {
    // Guardamos la config de la elección para que el Dashboard sepa qué cargar
    localStorage.setItem('activeElectionConfig', JSON.stringify(election));
    navigate('/user/dashbord');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-poppins">
      
      {/* HEADER USUARIO */}
      <div className="w-full bg-blue-950 text-white py-6 px-8 shadow-lg mb-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-800 p-3 rounded-full">
                <UserCircle size={32} />
            </div>
            <div>
                <h2 className="text-xl font-bold">Hola, {currentUser.Nombres}</h2>
                <p className="text-blue-200 text-sm">DNI: {currentUser.DNI}</p>
            </div>
          </div>
          <button 
            onClick={() => {
                localStorage.removeItem('usuarioActual');
                navigate('/');
            }}
            className="text-sm bg-blue-900 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors border border-blue-700"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="w-full max-w-4xl px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 border-l-4 border-blue-600 pl-4">
            Elecciones Disponibles
        </h1>
        <p className="text-gray-500 mb-8 pl-5">
          Selecciona una elección para emitir tu voto electrónico.
        </p>

        {elections.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                <p className="text-gray-400 text-lg">No hay elecciones activas en el sistema.</p>
            </div>
        ) : (
            <div className="grid gap-6">
                {elections.map((election) => {
                    // Lógica de estado
                    const active = isElectionActive(election);
                    
                    // Puede votar SI: La elección está activa Y (No ha votado)
                    const canVote = active && !hasVoted;

                    return (
                        <div 
                            key={election.id} 
                            className={`
                                relative bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300
                                ${canVote ? 'border-blue-100 hover:border-blue-400 hover:shadow-lg' : 'border-gray-200 bg-gray-50'}
                            `}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                
                                {/* INFO IZQUIERDA */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                                            active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {active ? 'En Curso' : 'Cerrada'}
                                        </span>
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-gray-200 text-gray-600 uppercase">
                                            {election.type}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{election.name}</h3>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Calendar size={16} />
                                        <span>{election.startDate} - {election.endDate}</span>
                                    </div>
                                </div>

                                {/* BOTONES DE ACCIÓN (DERECHA) */}
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    
                                    {/* CASO 1: YA VOTÓ */}
                                    {hasVoted ? (
                                        <div className="flex items-center gap-2 text-green-700 bg-green-100 px-6 py-3 rounded-xl w-full md:w-auto justify-center border border-green-200 shadow-inner">
                                            <CheckCircle size={24} />
                                            <div>
                                                <span className="font-bold block leading-none">Voto Emitido</span>
                                                <span className="text-xs">Gracias por participar</span>
                                            </div>
                                        </div>
                                    ) : (
                                        /* CASO 2: AÚN NO VOTA (Activa o Cerrada) */
                                        <button
                                            onClick={() => handleSelectElection(election)}
                                            disabled={!canVote}
                                            className={`
                                                flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-lg w-full md:w-auto transition-all
                                                ${canVote 
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:scale-105' 
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                                            `}
                                        >
                                            {!active ? (
                                                <><Lock size={20}/> No Disponible</>
                                            ) : (
                                                <><Vote size={20}/> Votar Ahora</>
                                            )}
                                            {canVote && <ChevronRight size={20} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};

export default ElectionSelectorPage;