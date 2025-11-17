import React, { useState } from "react";
import Duda from "./../../img/landing/duda.png";

interface ModalInfoProps {
  open: boolean;
  onClose: () => void;
}

const MoreInfo: React.FC<ModalInfoProps> = ({ open, onClose }) => {
  const [isVisible, setIsVisible] = useState(false); 
  const [closing, setClosing] = useState(false);      


  if (open && !isVisible) {
    setIsVisible(true);
    setClosing(false);
  }

  const AnimationClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 150);
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        onClick={AnimationClose}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm
          ${closing ? "animate-fadeOut" : "animate-fadeIn"}`}
      >
        <div
          className={`bg-white w-[90%] max-w-2xl rounded-2xl p-8 shadow-[0_0_3px_1px_rgba(20,33,133,1)] font-poppins
              ${closing ? "animate-scaleOut" : "animate-scaleIn"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end">
            <button
              onClick={AnimationClose}
              className="text-4xl font-bold transition-transform text-blue-950 hover:scale-110"
            >
              X
            </button>
          </div>

          <h1 className="mb-6 text-3xl font-bold text-center text-blue-950">
            INSTRUCCIONES
          </h1>

          <div className="px-4 space-y-6 text-xl font-semibold text-slate-800">
            <p>
              1) El primer paso es hacer clic en el botón de{" "}
              <span className="text-blue-800">INICIO</span> para que aparezca el siguiente panel.
            </p>
            <p>
              2) En el panel debe ingresar su DNI. Si el número es válido, sus datos aparecerán en pantalla.
            </p>
            <p>
              3) Si aparece un mensaje de{" "}
              <span className="text-red-700">ERROR</span>, verifique que el DNI esté escrito correctamente (sin letras o símbolos).
            </p>
            <p>
              4) Si sus datos son correctos, presione el botón{" "}
              <span className="text-blue-800">INICIAR</span> para continuar.
            </p>
          </div>

          <div className="flex justify-center mt-10">
            <img
              className="w-40 h-40 rounded-full shadow-md"
              src={Duda}
              alt="Duda icon"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MoreInfo;
