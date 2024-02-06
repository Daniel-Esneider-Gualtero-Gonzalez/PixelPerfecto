import React, { useRef, useState, useMemo } from 'react'
import { formData } from './DragandDrop'

function EditOptions({ onSubmit }) {
    const [isFormatJpg, setIsFormatJpg] = useState(false)
    const refFormAjustes = useRef()
    const [opciones, setOpciones] = useState(null)
    const guardarOpciones = useMemo(() => {
        if (!opciones) return
        console.log("save options")

        for (const key in opciones) {
            // si ya estan las opciones les asignamos las nuevas
            if (formData.get(`${key}`) || formData.get(`${key}`) === "") {

                formData.set(`${key}`, `${opciones[key]}`)
            } else {
                formData.append(`${key}`, `${opciones[key]}`)
            }

        }




    }, [opciones])
    const saveChanges = (e) => {
        const opciones = {}
        const form = refFormAjustes.current.elements
        for (let i = 0; i < form.length; i++) {
            const element = form[i];
            if (element.tagName === "INPUT" || element.tagName === "SELECT") {

                if (element.type === "checkbox") {
                    element.checked ? opciones[element.name] = 1 : opciones[element.name] = 0
                    continue
                }
                opciones[element.name] = element.value
            }


        }
        setOpciones(opciones)

        // miramos si el usuario a cambiado el formato a jpg ya que si lo activa debemos mostarle otro campo para que ingrese el color de fondo
        const formatIsJpg = opciones["format"] && opciones["format"] === "jpg"
        formatIsJpg ? setIsFormatJpg(true) : isFormatJpg !== false && setIsFormatJpg(false)


        console.log(opciones["crop"])

    }
    return (
        <>

            <form ref={refFormAjustes} onSubmit={(e) => {
                e.preventDefault()
                onSubmit()
            }} onChange={(e) => saveChanges(e)} className='w-full  '>
                <div className="grid  gap-4  ">

                    <article className='p-4 bg-gray-800 border border-gray-700 rounded'>
                        <label className="" >Desea conservar</label>
                        <select className='block w-full border py-2 mt-2 rounded-md border-gray-200 dark:border-gray-600 ' name="type" id="">
                            <option value="person">Personas</option>
                            <option value="object">Objetos</option>
                            <option value="stamp">Sellos o marcas</option>
                        </select>
                        <span className='mt-2 flex'>Decription</span>
                        <p className='text-sm'>"person": Conserva a la persona o personas como primer plano. Si hay personas en la imagen, intentará mantenerlas y eliminar el resto. <br />

                            "object": Conserva productos u objetos como primer plano. Si la imagen contiene objetos, intentará mantenerlos y eliminar el resto. <br />

                            "stamp": Conserva sellos como primer plano. Si hay sellos en la imagen, intentará mantenerlos y eliminar el resto.</p>
                    </article>



                    <article className='p-4 bg-gray-800 border border-gray-700 rounded'>
                        <label className="relative inline-flex items-center me-5 cursor-pointer">
                            <input type="checkbox" value="0" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Recortar regiones vacías.</span>
                        </label>

                        <p className='text-sm mt-1'>  Si la imagen tiene áreas vacías (sin contenido) alrededor, estas se recortarán, y la imagen resultante contendrá solo la región que tiene contenido.</p>
                    </article>

                    <article className='p-4 bg-gray-800 border border-gray-700 rounded'>
                        <label >Formato de imagen de salida</label>
                        <select className='block w-full border py-2 mt-2 rounded-md border-gray-200 dark:border-gray-600 ' name="format" id="format">
                            <option value="png">png</option>
                            <option value="jpg">jpg</option>

                        </select>

                        <span className='mt-2 flex'>Descripción</span>
                        <p className='text-sm mt-1'>Formato PNG con fondo transparente predeterminado. <br />
                            Si elije Formato JPG podra cambiar el color del fondo. </p>


                    </article>

                    {isFormatJpg && <div className='p-4 bg-gray-800 border border-gray-700 rounded'>

                        <label >Color de fondo <span className='text-sm'>Solo si es jpg </span></label>
                        <input name='bg_color' id="bg_color" type="text" className="block w-full px-4 py-2 mt-2  border border-gray-200 rounded-md  dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />

                        <span className='mt-2 flex'>Description</span>
                        <p className='text-sm mt-1'>
                            Añade un fondo de color sólido. Puede ser un código de color hexadecimal (por ejemplo, 81d4fa, ffffff).
                            Si este campo está vacío, el color predeterminado es blanco.</p>

                    </div>}
                </div>

                <button className='w-full mt-2  focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'>Enviar</button>
            </form>
        </>
    )
}

export default EditOptions