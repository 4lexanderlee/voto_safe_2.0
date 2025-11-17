import iconOnpe from "./../img/landing/iconoonpe.png"
import iconCheck from "./../img/landing/VOTA CON RESPOSIBILIDAD AMIGO (3).png"
import { useEffect, useState } from "react"

// Importar imágenes del carrusel correctamente
import img1 from "./../img/landing/VotaConResponsabilidad1.png"
import img2 from "./../img/landing/VotaConResponsabilidad2.png"
import img3 from "./../img/landing/VotaConResponsabilidad3.png"

// Importamos el MODAL (componente) y los demas 
import ModalInfo from "./../components/landingPage/moreInfo"
import DniPanel from "./../components/landingPage/DniPanel"
import DniInfoPanel from "./../components/landingPage/DniInfoPanel"
// props del lading page


const images = [img1, img2, img3];

const LandingPage = () => {
    
    const [index, setIndex] = useState(0);
    // para el modal +info :v 
    const [showModal,setShowModal] = useState(false);

    // Se define los estados que controlarán mostrar. 
    // estos son estados para controlar las 3 paginas que serian inicio , dni e ifnoDni :v
    const [pasoActual, setPasoActual] = useState('inicio');

    // Esta funcion se llamara al hacer clicl en el boton 
    
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div id="main_container">


            <div className="min-w-full h-16 bg-white flex-initial shadow-[0_2px_4px_rgba(15,54,109,0.65)]">
                <img 
                    src={iconOnpe} 
                    className="w-24 p-1 pl-5 my-auto cursor-pointer"  
                />
            </div>

            
            <div id="body_contend" className="flex flex-row justify-around w-full h-full">

                
                <div className="relative flex items-center justify-center w-1/2 h-full ml-5">

                    <img 
                        src={images[index]} 
                        className="w-[40%] rounded-xl shadow-lg transition-all duration-700 mt-10 ml-10"
                    />

                  
                </div>

               {/*
                elementos a renderizar dependiendo el 'estado' 
               */}
                <div className="flex flex-col items-center w-1/2 h-full mr-10">

                    {
                        pasoActual==='inicio' && (
                            <>
                            <div className="flex flex-col items-center justify-center w-5/6 mt-20">
                        <h1 className="text-6xl font-bold text-center text-blue-950 font-poppins">
                            ELECCIONES GENERALES 2026
                        </h1>
                        <img 
                            src={iconCheck} 
                            className="w-1/5 mt-10 mr-10"
                        />
                    </div>

                    <div className="flex flex-col w-9/12 gap-5 mt-10">
                        <p className="text-xl font-bold text-center text-gray-700 font-poppins">
                            Realiza tu voto seguro, resuelve tus dudas para un voto responsable y siempre con previo estudio.
                        </p>

                        <button 
                        onClick={() => setPasoActual('dni')}
                        className="w-1/3 mx-auto text-xl font-medium text-white transition-transform duration-200 bg-blue-950 hover:scale-105 rounded-xl h-11 font-poppins">
                            INICIAR
                        </button>
                    </div>
                    <ModalInfo open={showModal} onClose={() => setShowModal(false)}/>
                    <div className="w-16 h-16 rounded-full bg-blue-950 ml-[80%] mt-52 transition-transform duration-200 hover:scale-105">
                        <button className="w-full h-full text-3xl text-white font-poppins " onClick={() => setShowModal(true)}>?</button>
                    </div>
                    </>
                        )}
                    {pasoActual==='dni' && 
                        ( <>
                            <DniPanel onVolver={() => setPasoActual('inicio')}
                                        onIngresar={() => setPasoActual('DniInfo')}/>
                            <ModalInfo open={showModal} onClose={() => setShowModal(false)}/>
                    <div className="w-16 h-16 rounded-full bg-blue-950 ml-[80%] mt-52 transition-transform duration-200 hover:scale-105">
                        <button className="w-full h-full text-3xl text-white font-poppins " onClick={() => setShowModal(true)}>?</button>
                    </div>
                            </>

                            
                        )
                    }

                    {
                        pasoActual==='DniInfo' && (
                            <>
                            <DniInfoPanel 
                                onVolver={() => setPasoActual('dni')}
                                />
                            <ModalInfo open={showModal} onClose={() => setShowModal(false)}/>
                    <div className="w-16 h-16 rounded-full bg-blue-950 ml-[80%] mt-0 transition-transform duration-200 hover:scale-105">
                        <button className="w-full h-full text-3xl text-white font-poppins " onClick={() => setShowModal(true)}>?</button>
                    </div>

                            </>
                        )
                    }

                </div>

            </div>
        </div>
    );
};

export default LandingPage;
