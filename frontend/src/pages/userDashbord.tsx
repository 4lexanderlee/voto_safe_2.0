import React, { useState, useEffect } from 'react';
import OnpeLogo from './../img/landing/iconoonpe.png';
import { useNavigate } from 'react-router-dom';
import ChatWidget from '../components/userDashbord/chatWidget';
import MoreInfoPostulante from '../components/userDashbord/moreInfoPostulante';
import Swal from 'sweetalert2';

// ---- 1. INTERFACES (NUEVO: Para leer tus datos reales) ----
interface ElectionConfig {
    id: string;
    name: string;
    categories: { id: string; name: string }[];
}

interface Party {
    id: string;
    name: string;
    logoUrl?: string;
    electionId: string;
    proposals?: string[];
    color?: string;
}

interface UserData {
    DNI: string;
    Nombres: string;
    Estado: string;
}

// Interfaz de UI (Mantenemos la estructura que usa tu tarjeta)
interface CandidateUI {
    id: string;
    name: string;
    avatarUrl: string;
    category: string; 
    proposals: string[];
    partidoP: string;
}

interface CategoryUI {
    key: string;
    label: string;
}

// ---- CUSTOM HOOK useLocalStorage ----
function useLocalStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setAndStore = (newValue: T) => {
        try {
            setValue(newValue);
            localStorage.setItem(key, JSON.stringify(newValue));
        } catch {}
    };

    return [value, setAndStore] as const;
}

// ---- TARJETA DE CANDIDATO (TU DISEÑO ORIGINAL INTACTO) ----
const CandidateCard: React.FC<{ 
    candidate: CandidateUI;
    onClick: (id: string) => void;
    isSelected: boolean;
    onShowProposals:(candidate: CandidateUI)=> void;
}> = ({ candidate, onClick, isSelected, onShowProposals }) => (
    <div
        className={`relative w-44 h-48 bg-[#0A2A66] rounded-lg shadow-md flex flex-col items-center justify-center p-2 cursor-pointer
        transition-all duration-200 ease-in-out transform
        ${isSelected ? 'border-4 border-blue-500 scale-105' : 'border border-gray-200 hover:shadow-lg'}`}
        onClick={() => onClick(candidate.id)}
    >

        {/* ÍCONO CHECK */}
        {isSelected && (
            <div className="absolute p-1 text-white bg-blue-600 rounded-full top-2 left-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
        )}

        {/* ÍCONO MENSAJE INTERACTIVO */}
        <button
            onClick={(e) => {
                e.stopPropagation(); 
                onShowProposals(candidate); 
            }}
            className="absolute p-2 text-white transition-all duration-200 bg-red-500 rounded-full shadow-md cursor-pointer top-2 right-2 hover:scale-110 active:scale-95 hover:shadow-lg"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.92 2 11.5c0 2.26 1.14 4.34 3.07 5.86L4 21l4.02-1.7
                c1.01.28 2.09.43 3.23.43c5.52 0 10-3.92 10-8.5S17.52 3 12 3z" />
            </svg>
        </button>

        {/* FOTO */}
        <div className="w-24 h-24 rounded-full border-2 border-[#4A6BB6] mb-2 bg-white overflow-hidden flex items-center justify-center">
             {candidate.avatarUrl ? (
                <img src={candidate.avatarUrl} alt={candidate.name} className="w-full h-full object-cover" />
             ) : (
                <span className="text-3xl font-bold text-gray-400">{candidate.name.charAt(0)}</span>
             )}
        </div>

        {/* NOMBRE */}
        <p className="px-1 text-base font-poppins font-semibold leading-tight text-center text-white">
            {candidate.name}
        </p>
    </div>
);

// ---- PÁGINA PRINCIPAL ----
const UserDashbord: React.FC = () => {
    const navigate = useNavigate();

    // ---- 2. ESTADOS NUEVOS (Reemplazan a los arrays fijos) ----
    const [electionConfig, setElectionConfig] = useState<ElectionConfig | null>(null);
    const [categories, setCategories] = useState<CategoryUI[]>([]);
    const [candidates, setCandidates] = useState<CandidateUI[]>([]);
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);

    // ZONA DEL mas info de postulante (Tu código original)
    const [modalCandidate, setModalCandidate] = useState<CandidateUI | null>(null); // Ajustado tipo
    const manejoMostrarInfo = (candidate: CandidateUI) => { setModalCandidate(candidate); }

    // zona del chat ia (Tu código original)
    const [isChatOpen, setIsChatOpen] = useState(false);
    const handOpenChat = () => setIsChatOpen(true);
    const handCloseChat = () => setIsChatOpen(false);

    // Estados persistentes (Tu código original)
    const [activeCategory, setActiveCategory] = useLocalStorage<string>('activeCategory', '');
    const [selectedVotes, setSelectedVotes] = useLocalStorage<Record<string, string | null>>('selectedVotes',{});

    // ---- 3. EFECTO DE CARGA (NUEVO: Conecta la lógica) ----
    useEffect(() => {
        // A. Cargar Usuario
        const userRaw = localStorage.getItem('usuarioActual');
        if (!userRaw) { navigate('/'); return; }
        setCurrentUser(JSON.parse(userRaw));

        // B. Cargar Elección Activa
        const configRaw = localStorage.getItem('activeElectionConfig');
        if (!configRaw) { navigate('/user/ballots'); return; } // Si no hay elección, regresar
        const config: ElectionConfig = JSON.parse(configRaw);
        setElectionConfig(config);

        // C. Generar Categorías
        if (config.categories && config.categories.length > 0) {
            const mappedCats = config.categories.map(c => ({ key: c.id, label: c.name.toUpperCase() }));
            setCategories(mappedCats);
            
            // Seleccionar la primera categoría si no hay una activa
            if (!activeCategory || !mappedCats.find(c => c.key === activeCategory)) {
                setActiveCategory(mappedCats[0].key);
            }
        }

        // D. Cargar Partidos y convertirlos a Candidatos para tu UI
        const partiesRaw = localStorage.getItem('votosafe_parties');
        if (partiesRaw) {
            const allParties: Party[] = JSON.parse(partiesRaw);
            const relevantParties = allParties.filter(p => p.electionId === config.id);
            
            // Mapeo de Party (DB) a CandidateUI (Tu diseño)
            const mappedCandidates: CandidateUI[] = relevantParties.map(p => ({
                id: p.id,
                name: p.name,
                avatarUrl: p.logoUrl || '',
                category: '', // Truco: se mostrarán en todas las categorías
                partidoP: p.name,
                proposals: p.proposals || ["Ver plan de gobierno"]
            }));
            setCandidates(mappedCandidates);
        }
    }, [navigate]); // activeCategory removido de deps para evitar loop

    // ---- MANEJADORES (Tu código original + ajustes menores) ----
    const handleCategoryClick = (key: string) => {
        setActiveCategory(key);
    };

    const handleCandidateClick = (id: string) => {
        setSelectedVotes(prevVotes => {
            const currentVoteForCategory = prevVotes[activeCategory];
            return {
                ...prevVotes,
                [activeCategory]: currentVoteForCategory === id ? null : id
            }
        })
    };

    const handleVoteBlank = () => {
        setSelectedVotes(prevVotes => ({
            ...prevVotes,
            [activeCategory]: 'VOTO_BLANCO'
        }))
    };

    // FILTRADO (Adaptado: Mostramos todos los partidos de la elección en cada categoría)
    const filteredCandidates = candidates; 

    const CategoriasVotadas = categories.length > 0 && categories.every(
        (category) => !!selectedVotes[category.key]
    );
    
    const isSubmissionDisabled = !CategoriasVotadas;

    // ---- 4. SUBMIT (NUEVO: Guarda en DB real) ----
    const handleSubmitVotes = () => {
        if(isSubmissionDisabled || !currentUser || !electionConfig) {
            console.error("Faltan datos o categorías");
            return;
        }
        
        try {
            // A. Crear objeto de voto
            const newVote = {
                id: crypto.randomUUID(),
                userId: currentUser.DNI,
                electionId: electionConfig.id,
                electionName: electionConfig.name,
                votedAt: new Date().toISOString(),
                votes: Object.entries(selectedVotes).map(([catKey, partyId]) => {
                    const partyName = partyId === 'VOTO_BLANCO' 
                        ? 'Voto en Blanco' 
                        : candidates.find(c => c.id === partyId)?.name || 'Desconocido';
                    const catName = categories.find(c => c.key === catKey)?.label || 'General';

                    return {
                        categoryId: catKey,
                        categoryName: catName,
                        partyId: partyId || 'blanco',
                        partyName: partyName
                    };
                })
            };

            // B. Guardar en votosafe_votes
            const currentVotes = JSON.parse(localStorage.getItem('votosafe_votes') || '[]');
            currentVotes.push(newVote);
            localStorage.setItem('votosafe_votes', JSON.stringify(currentVotes));

            // C. Actualizar estado del usuario en usuariosData
            const allUsers = JSON.parse(localStorage.getItem('usuariosData') || '[]');
            const updatedUsers = allUsers.map((u: any) => 
                u.DNI === currentUser.DNI ? { ...u, Estado: 'voto' } : u
            );
            localStorage.setItem('usuariosData', JSON.stringify(updatedUsers));

            // D. Limpiar y salir
            localStorage.removeItem('selectedVotes');
            localStorage.removeItem('activeCategory');
            Swal.fire({
                title:'VOTO REALIZADO!',
                text:"Su voto se ha almacenado correctamente",
                icon:'success',
                showConfirmButton: false,
                timer:1200,
                customClass: {
                    popup: "font-bold font-poppins"
                }
            })
            navigate('/user/ballots');

        } catch (e) {
            console.error("Error al guardar voto", e);
            alert("Error al procesar el voto.");
        }
    }

    // ---- RENDERIZADO (TU DISEÑO EXACTO) ----

    if (!electionConfig) return <div className="flex h-screen items-center justify-center">Cargando...</div>;

    return (
        <div className="flex flex-col items-center min-h-screen pb-8 bg-gray-100">

            {/* ---- BARRA SUPERIOR ---- */}
            <header className="
                w-full bg-white py-2 px-6 flex justify-between items-center
                border-b-2 border-[#0A2A66]
                drop-shadow-[0px_10px_30px_rgba(0,0,0,0.15)]
            ">
                <img 
                    src={OnpeLogo}
                    alt="ONPE Logo"
                    className="object-contain w-auto h-12"
                />

                {/* BOTÓN SALIDA */}
                <button className="flex items-center bg-[#0A2A66] text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-[#0C357F] transition-colors"
                        onClick={() => navigate('/user/ballots')}>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Cancelar
                </button>
            </header>

            {/* TÍTULO (Ahora muestra el nombre real de la elección) */}
            <h1 className="mt-8 mb-6 text-3xl font-extrabold tracking-wide text-blue-900 uppercase text-center">
                {electionConfig.name} <br/>
                
            </h1>

            {/* BOTONES DE CATEGORÍA (Generados dinámicamente) */}
            <nav className="flex flex-row  justify-center gap-3 px-4 py-4 mb-8 w-[80%]">
                {categories.map((category) => {
                    const isActive = activeCategory === category.key;
                    const hasVote = !!selectedVotes[category.key];

                    return (
                        <button
                            key={category.key}
                            onClick={() => handleCategoryClick(category.key)}
                            className={`
                                px-6 py-2 text-white font-semibold rounded-full text-base
                                transition-all duration-300 ease-in-out transform
                                flex items-center justify-center gap-2
                                ${isActive ? 'bg-blue-900 shadow-xl scale-105' : 'bg-gray-400 hover:bg-gray-500'}
                            `}
                        >
                            {
                                hasVote && (
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )
                            }
                            {category.label}
                        </button>
                    );
                })}
            </nav>

            {/* ---- CANDIDATOS FILTRADOS ---- */}
            <div className="flex flex-row justify-center items-center gap-10 flex-wrap w-[50%] m-0">

                {filteredCandidates.map((candidate) => (
                    <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onClick={handleCandidateClick}
                        isSelected={selectedVotes[activeCategory] === candidate.id}
                        onShowProposals={manejoMostrarInfo}
                    />
                ))}

                {/* ---- VOTO EN BLANCO ---- */}
                <div
                    className={`
                        relative w-44 h-48 bg-[#E4E9F2] rounded-lg shadow-md flex flex-col items-center justify-center 
                        p-2 cursor-pointer transition-all duration-200 ease-in-out transform
                        ${selectedVotes[activeCategory] === 'VOTO_BLANCO'
                            ? 'border-4 border-[#4ECDE6] scale-105'
                            : 'border border-[#4ECDE6] hover:shadow-lg'}
                    `}
                    onClick={handleVoteBlank}
                >
                    <p className="text-xl font-bold text-center text-blue-900">
                        VOTO<br/>EN BLANCO
                    </p>
                </div>
            </div>

            {/* NUEVO BOTON (Lógica real inyectada) */}
            <div className="w-[300px] max-w-4xl px-4 mt-[7%] mb-0"> 
                <button
                    onClick={handleSubmitVotes}
                    disabled={isSubmissionDisabled}
                    className={`
                        w-full py-4 text-xl font-bold text-white border-2 border-blue-300/50 uppercase rounded-xl shadow-xl
                        transition-all duration-300 ease-in-out transform
                        ${isSubmissionDisabled
                            ? 'bg-gray-500 cursor-not-allowed opacity-70'
                            : 'bg-blue-900 hover:scale-[1.02]'
                        }
                    `}
                >
                    {isSubmissionDisabled 
                        ? 'Debe votar en todas las categorías'
                        : 'Enviar Voto'}
                </button>
            </div>

            {/* ---- BOTÓN CHAT IA ---- */}
            {!isChatOpen && (
                <button
                onClick={handOpenChat}
                className="
                    fixed bottom-6 right-6 bg-[#0A2A66] text-white 
                    p-4 rounded-full shadow-lg shadow-blue-900/40
                    hover:scale-110 active:scale-95 transition-transform
                "
            >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.48 3 2 6.92 2 11.5c0 2.26 1.14 4.34 3.07 5.86L4 21l4.02-1.7
                    c1.01.28 2.09.43 3.23.43c5.52 0 10-3.92 10-8.5S17.52 3 12 3z" />
                </svg>
            </button>
            )}
            {isChatOpen && (
                <ChatWidget onClose={handCloseChat}/>
            )}

            {/** Renderizado del modal */}
            {modalCandidate && (
                <MoreInfoPostulante
                    candidate={modalCandidate}
                    onClose={() => setModalCandidate(null)}
                />
            )}

        </div>
    );
};

export default UserDashbord;