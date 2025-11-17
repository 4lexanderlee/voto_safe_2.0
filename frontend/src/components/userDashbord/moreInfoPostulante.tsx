
import React from "react";

interface Candidate {
    id: string;
    name: string;
    avatarUrl: string;
    category: string;
    partidoP: string;
    proposals: string[];
    
}

type CandidateDetailProps = {
    candidate:Candidate;
    onClose: () => void;
}

const MoreInfoPostulante:React<CandidateDetailProps> = ({candidate,onClose}) => {

    return(
        <>
        <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose} // Cierra al hacer clic afuera
    >
      {/* Ventana de Detalles */}
      <div 
        className="relative w-full h-auto max-w-3xl px-6 pt-10 pb-16 mx-auto bg-white shadow-xl rounded-xl"
        onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic adentro
      >
        {/* Botón de Cerrar (Esquina) */}
        <button 
          onClick={onClose} 
          className="absolute text-gray-500 top-3 right-3 hover:text-gray-800"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* --- Contenido del Candidato --- */}
        <div className="flex items-center mb-5">
          <img 
            src={candidate.avatarUrl} 
            alt={candidate.name} 
            className="w-24 h-24 mx-2 border-2 rounded-full border-blue-950" 
          />
          <div className="ml-4">
            <label htmlFor="" className="font-semibold font-poppins">Postulante</label>
            <h3 className="mt-0 mb-1 text-3xl font-bold text-blue-950">{candidate.name}</h3>
            <label htmlFor="" className="mt-1 mb-0 font-semibold font-poppins">Partido Politico</label>
            <h3 className="mt-0 mb-1 text-3xl font-bold text-blue-950">{candidate.partidoP}</h3>
          </div>
        </div>

        <div className="w-full h-10 ml-5 text-blue-950 mt-9">
            <h3 className="text-3xl font-bold text-gray-800 border-b font-poppins ">Propuestas Principales</h3>
        </div>
        <div className="w-full mt-5 ml-5 h-36">
            <ul className="h-48 space-y-2 overflow-y-auto list-disc list-inside">
          {candidate.proposals.map((proposal, index) => (
            <li key={index} className="text-xl font-bold text-black font-poppins">{proposal}</li>
          ))}
        </ul>
        </div>
        
      </div>
    </div>
        </>
    )
}

export default MoreInfoPostulante;