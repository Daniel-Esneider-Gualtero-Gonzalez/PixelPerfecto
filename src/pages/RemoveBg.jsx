import React, { useEffect, useRef } from 'react'
import { formData, image, nameFile } from '../components/DragandDrop'
import EditOptions from '../components/EditOptions'
import useRemoveBg from '../hooks/useRemoveBg'
import Loading from '../components/Loading'
import { useNavigate } from 'react-router-dom'
import { descargarImagen, obtenerNombreYextencionArchivo } from '../utils/imageUtils'

function RemoveBg() {
    const navigate = useNavigate()
    const refBtnDowload = useRef()
    const { loading, error, result, removeBg } = useRemoveBg()

    useEffect(()=>{
        if(!formData.get("image_file")) return navigate("/")
        removeBg(formData)
    } ,[])

    useEffect(() => {
        if (!result) return
    
        // typo de la imagen extencio png jpg para cuando se vaya a descargar
        
        const formatImage = formData.get("format")
        const extractBase64 = result.split(",")[1]

        const { url } = descargarImagen(extractBase64, formatImage)
    
        const { name } = obtenerNombreYextencionArchivo(nameFile)
        refBtnDowload.current.href = url
        refBtnDowload.current.download = `${name}.${formatImage}`
    
      }, [result])

    return (
        <section className='p-10 flex flex-col  bg-gray-900'>
            <h1 className='text-2xl'>Ajusta tu imagen como prefieras</h1>

            <article className='grid grid-cols-4 gap-2 p-10 rounded border'>
                <div disabled={loading ? true : false} className={`${loading && 'opacity-30 bg-gray-600'} col-span-2`}>
                    <EditOptions onSubmit={()=> removeBg(formData)}/>
                </div>
                <div className='col-span-2 border'>
                    <div className='w-[400px] overflow-hidden mx-auto border relative rounded  h-[400px]'>
                        {result && <img className='w-full h-full object-cover' src={result} alt="" />}
                        {loading && <Loading className="absolute top-0 bottom-0 left-0 right-0 mx-auto my-auto  w-fit h-fit" />}
                    </div>


                     {result && !loading && <a ref={refBtnDowload}><svg   className='size-10 mx-auto mt-2 rounded border' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></svg></a>}
                </div>
            </article>
        </section>
    )
}

export default RemoveBg