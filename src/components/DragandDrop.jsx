import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AgujeroNegro from './AgujeroNegro';
import Alert from './Alert';
import Loading from './Loading';

export const API_KEY = "wxtnwtut8wzsgs2pn"
export const formData = new FormData();
export let image = null
export let nameFile = null
formData.append("format", "png")
formData.append("sync", 1);
formData.append("return_type", 2);


function DragAndDrop() {
  const [errorFile, setErrorFile] = useState(null)
  const navigate = useNavigate()
  const [loading,setLoading] = useState(false)
  const [imageCurrent, setImageCurrent] = useState(null)
  const [style, setStyle] = useState(null)

  const handleErrorFile = (errorText) => {
    setErrorFile(errorText)
    setTimeout(() => {
      setErrorFile(null)
    }, 5000)
  }
  // GUARDA EL ARCHIVO convirtiendolo a blob y guardandolo a blob
  const saveFile = (file) => {

    const archivoBinario = new Blob([file], { type: file.type })

    if (formData.get("image_file")) {
      return formData.set("image_file", archivoBinario, `${file.name}`)

    } else {
      return formData.append("image_file", archivoBinario, `${file.name}`)
    }

  }

  const redirect = () => {
    setTimeout(() => navigate("/removeBg"), 3000)
  }

  const cumpleSize = (bytes) => {
    const sizeFile = Math.ceil(bytes / (1024 * 1024))
    console.log("peso de la imagen o file", sizeFile)

    if (sizeFile > 15) return false
    return true
  }


  const changeFileInput = useCallback(async (event) => {
    const file = event.target.files[0]

    if (!cumpleSize(file.size)) return handleErrorFile("Solo se admiten imagenes de peso menor o igual a 50 Mb")
    nameFile = file.name

    const imageSrc = await base64Image(file)
    if (imageSrc.error) {
      return console.log("ERROR  al convertir", imageSrc.error)
    }
    image = imageSrc
    setImageCurrent(imageSrc)
    saveFile(file)
    redirect()



  })

  // este es el onDrop nativo que suelta archivos desde cualquier lado especialmente desde el mismo navegador
  const onDropFile = async (e) => {
    e.preventDefault()
    setStyle(null)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]


      if (file.type.includes("image/")) {
        if (!cumpleSize(file.size)) return handleErrorFile("Solo se admiten imagenes de peso menor o igual a 50 Mb")
        const imageSrc = await base64Image(file)
        if (imageSrc.error) {
          return console.log("ERROR  al convertir", imageSrc.error)
        }
        nameFile = file.name
        saveFile(file)
        setImageCurrent(imageSrc)
        redirect()


      }
      if (!file.type.includes("image/")) return handleErrorFile("Solo se permiten archivos tipo imagen")


    } else {
      handleErrorFile("Error al obtener el archivo. Intente nuevamente o verifique el archivo")
    }

    setStyle(null)

  }

  const onSubmitImageUrl = async (e) => {
    e.preventDefault()
    const url = e.target.elements[0].value.trim()
    try {
      setLoading(true)
      const fetchImage = await fetch(url)
      if(!fetchImage.ok) return handleErrorFile("No se pudo procesar esta url intente con otra")
      const contentType = fetchImage.headers.get('content-type')

      if(!contentType.includes("image/")) return handleErrorFile("Verifica que la url sea de una imagen valida")
      formData.append("image_url", `${url}`)
      setImageCurrent(url)
      redirect()



  } catch (error) {
      return handleErrorFile("error al procesar la url de la imagen")
      
  }finally{
    setLoading(false)
  }
  
  }


  return (
    <>
      <section className=' bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black  bg-no-repeat bg-cover w-screen h-screen flex flex-col items-center justify-center '>
        {errorFile && <Alert error={true} text={errorFile} />}
        <h1 className='text-2xl'>Arrastra tu imagen hasta aqui ⬇️</h1>
        <h2 className='text-yellow-600'> o Click sobre el recuadro para seleccionar una.</h2>
        <article className={`${style && 'scale-110'}  border border-dashed transition-transform duration-500      ease-out  agujeronegro-container  w-[650px] h-[450px] relative  flex justify-center items-center p-10`}>

          <div className='relative grayscale   z-[99] w-full h-full flex justify-center items-center  '>
            <AgujeroNegro />
          </div>


          {imageCurrent && <img className='animation-drop  z-[100] w-[100px] h-[100px] rounded absolute top-0 bottom-0 left-0 right-0 my-auto mx-auto' src={`${imageCurrent}`} alt="" />}

          <input onDragOver={(e) => e.preventDefault()} onDrop={onDropFile} onDragLeave={() => setStyle(null)} onDragEnter={(e) => {
            setStyle(true)
          }} accept=".jpg, .jpeg, .png, .webp" className={`opacity-0  w-full z-[999999]  rounded absolute border-[3px] border-dashed border-white transition-transform duration-300  ease-out h-full   `} onChange={changeFileInput} type="file" />
        </article>



        <form className='mt-4 flex items-center ' onSubmit={onSubmitImageUrl}>
          <label className=' text-yellow-600  ' htmlFor="">O ingresa la url ➡️</label>
          <input className=' rounded p-1 mx-4 focus:outline-blue-600 focus:outline  border' type="url" name="urlimage" id="urlimage" required />
           {loading ?  <Loading />  :  <button className='border rounded-full hover:scale-105  transition-all duration-300 bg-blue-800 hover:bg-blue-900  h-fit  p-1'><svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg></button>}
        </form>

      </section>


    </>

  );
}




export default DragAndDrop;





async function base64Image(fileImg) {


  try {
    const imagenBase64 = await readFileAsDataURL(fileImg)
    return imagenBase64
  } catch (error) {
    return { error: "Error al convertir el archivo imagen" }
  }

}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // Configurar la función de retorno de llamada cuando la lectura se complete
    reader.onload = function (e) {
      resolve(e.target.result);
    };

    // Configurar la función de retorno de llamada en caso de error
    reader.onerror = function (error) {
      reject(error);
    };


    reader.readAsDataURL(file);
  });
}


function arhivoABinario(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // Configurar la función de retorno de llamada cuando la lectura se complete
    reader.onload = function (e) {
      resolve(e.target.result);
    };

    // Configurar la función de retorno de llamada en caso de error
    reader.onerror = function (error) {
      reject(error);
    };


    reader.readAsArrayBuffer(file);
  });
}




