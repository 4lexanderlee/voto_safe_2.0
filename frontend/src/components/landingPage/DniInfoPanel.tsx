import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type DniInfoPanelProps = {
  onVolver:() => void;
}

interface UserData{
  DNI: string;
  Nombres: string;
  Apellidos: string;
  "Fecha Nac.": string;
  Tipo: string;
  Departamento:string;
  
}

const CargarDatosUsuario = ():UserData => {
  const datosGuardados = localStorage.getItem('usuarioActual');
  
  if(datosGuardados) {
    return JSON.parse(datosGuardados) as UserData;
  }

  return {
    DNI: 'error',
    Nombres: 'error',
    Apellidos: 'error',
    "Fecha Nac.": 'error',
    Tipo: 'error',
    Departamento:'error'
  };

}




const DniInfoPanel = ({onVolver}:DniInfoPanelProps) => {
    const navigate = useNavigate();

    const [formData] = useState<UserData>(CargarDatosUsuario);
    
    const handleSubmit = (): void => {
      console.log('iniciando sesion como ', formData.Nombres)
    };

    const Redirection = (): void => {
      const tipo = formData.Tipo;
      if(tipo==='user'){
        navigate('/user');
      } else {
        navigate('/admin')
      }
      
    }
    

    
    return(
      <>
      <div className="border-2 border-blue-950/70 shadow-[5px_5px_2px_4px_rgba(0,35,99,1)] font-poppins rounded-3xl bg-white w-[60%] h-[750px] mt-10 mr-10">
        <div className="flex flex-col items-center justify-start mt-4">
          <h2 className="text-2xl font-bold font-poppins text-blue-950">Datos Personales</h2>
          <div  className="flex flex-col items-center justify-center mt-12 text-lg w-[80%] font-semibold  font-poppins">
            
            <div className="flex flex-col w-[97%] h-[72px] m-1">
              <label htmlFor="" className="text-xl font-semibold text-blue-950">DNI</label>
              <input type="text" value={formData.DNI} readOnly className="transition ease-in-out border-2 border-b-black/40 focus:outline-none focus:border-b-blue-950 focus:ring-blue-950 focus:ring-offset-2 duration-250 " name="" id="" />
            </div>
            <div className="flex flex-col w-[97%] h-[72px]  m-1">
              <label htmlFor="" className="text-xl font-semibold text-blue-950">NOMBRE</label>
              <input  type="text" value={formData.Nombres} readOnly className="transition ease-in-out border-2 border-b-black/40 focus:outline-none focus:border-b-blue-950 focus:ring-blue-950 focus:ring-offset-2 duration-250 " name="" id="" />
            </div>
            <div className="flex flex-col w-[97%] h-[72px] m-1">
              <label htmlFor="" className="text-xl font-semibold text-blue-950">APELLIDO</label>
              <input type="text"  value={formData.Apellidos} readOnly className="transition ease-in-out border-2 border-b-black/40 focus:outline-none focus:border-b-blue-950 focus:ring-blue-950 focus:ring-offset-2 duration-250 "/>
            </div>
            <div className="flex flex-col w-[97%] h-[72px]  m-1">
              <label htmlFor="" className="text-xl font-semibold text-blue-950">F. DE NACIEMIENTO</label>
              <input type="text"  value={formData["Fecha Nac."]} readOnly className="transition ease-in-out border-2 border-b-black/40 focus:outline-none focus:border-b-blue-950 focus:ring-blue-950 focus:ring-offset-2 duration-250 "/>
            </div>
            <div className="flex flex-col w-[97%] h-[72px]  m-1">
              <label htmlFor="" className="text-xl font-semibold text-blue-950">TIPO DE USUARIO</label>
              <input type="text" value={formData.Tipo} readOnly className="transition ease-in-out border-2 border-b-black/40 focus:outline-none focus:border-b-blue-950 focus:ring-blue-950 focus:ring-offset-2 duration-250 "/>
            </div>
            <div className="flex flex-col w-[97%] h-[72px]  m-1">
              <label htmlFor="" className="text-xl font-semibold text-blue-950">DEPARTAMENTO</label>
              <input type="text" readOnly value={formData.Departamento} className="transition ease-in-out border-2 border-b-black/40 focus:outline-none focus:border-b-blue-950 focus:ring-blue-950 focus:ring-offset-2 duration-250 " />
            </div>
          </div>
          <div className="w-[45%] h-14 flex flex-col justify-center items-center mt-7 bg-blue-950 rounded-3xl transition-transform duration-200 hover:scale-105">
            <button className="text-xl  w-full h-full font-[500] text-white font-poppins"
            onClick={handleSubmit}
            onClickCapture={Redirection}
            >INICIAR</button>
          </div>
          <div className="w-[20%] h-10 mx-auto flex flex-col justify-center items-center my-7 transition-transform duration-200 hover:scale-105">
            <button className="w-full h-full text-xl font-semibold text-black/65 hover:text-black "
                    onClick={onVolver}
            >volver</button>
          </div>
        </div>
      </div>
      </>
    )


}

export default DniInfoPanel;