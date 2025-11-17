import {User} from 'lucide-react';
import React, { useEffect, useState } from 'react';
// props 
type PanelDniProps = {
  onVolver: () => void;
  onIngresar: () => void; 
}

interface usuarioData {
  DNI: string;
  [key: string]: any;
}


const PanelDni =  ({onVolver, onIngresar}: PanelDniProps) => {
  // creamos el estado para guardar el valor del input :v
  const [dni,setDni] = useState("");
  // estados de error
 
  
  
  // un USEEFFECT , este se ejecutara cada que la variable cambie , para que? para verificar que tenga los 8 numeros 
  // necesarios para pasar a la siguiente pagina y asi poder deshacernos del boton :v
  useEffect(() => {
    if(dni.length ===8) {
      const usuariosGuardados = localStorage.getItem('usuariosData');
      if(!usuariosGuardados) {
        
        return
      }
      
      try {
        const users: usuarioData[] = JSON.parse(usuariosGuardados)

        const usuarioEncontrado = users.find(user => user.DNI ===dni);

        if(usuarioEncontrado) {
          localStorage.setItem('usuarioActual',JSON.stringify(usuarioEncontrado));
          onIngresar();
        } else {
          console.log("Error : usuario no encontrado")
        } 
       } catch (e) {
        console.error("Error al procesar datos: ",e)
       }

    }
    else {
      console.log('error')
    }

    },[dni,onIngresar]);
    // ESTAS SON LAS VARIABLES EN LAS QUE SE ENFOCARA el useEffect , osea si cambian estas variables 
    // se ejecuta este effect
  

  
  

  
  // ahora que tenemos la funcion que ALMACENA necesitamos otra para manejar los cambios
  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // filtramos para que solo se puedan escribir numeros 
    const valorNumerico = e.target.value.replace(/[^0-9]/g,'');
    setDni(valorNumerico);
  } 
  return(
    <>

      <div className='shadow-[0px_0px_5px_1px_rgba(0,8,69,1)] font-poppins font-medium bg-white w-[50%] rounded-3xl  h-[400px] mt-24 p-5 flex flex-col
                       justify-start items-center '>
        <div className='flex flex-col items-center justify-center w-[82px] h-[82px] text-center rounded-full mb-9 bg-blue-950'>
          <User className='m-auto text-center w-14 h-14 text-blue-50'/>
          
        </div>
        <h2 className='m-0 text-xl font-semibold text-black font-poppins'>INGRESE SU DNI</h2>
        <div className='flex flex-col w-full h-20 bg-white'>
          <input type="text" className='m-auto w-[90%] h-10 rounded-sm  border-2 border-b-black/55
          focus:outline-none focus:border-b-blue-950 focus:border-2 focus:ring-blue-950  focus:ring-offset-2
                        transition duration-250 ease-in-out'
                        value={dni}
                        onChange={handleDniChange}
                        maxLength={8}
                        inputMode='numeric'
                        pattern='[0-9]*'
 />
        </div>
        
        <div className='flex flex-col justify-between w-full h-32 gap-4 p-2 mt-10 bg-white'>
          <div className='flex flex-col items-center justify-center w-[80%] h-10 p-2 m-auto text-center text-white transition-transform duration-200 bg-blue-950 rounded-3xl hover:scale-105'>
            <span className='w-full m-1'>solo los 8 numeros del DNI</span>
          </div>
          <div className='flex flex-col items-center justify-center w-32 m-auto text-xl transition-transform duration-200 text-stone-800 hover:scale-105'>
            <button className=' text-slate-900'
            onClick={onVolver}
                    
            >volver</button>
          </div>
        </div>
      </div>
    
    </>
  )


};

export default PanelDni;
