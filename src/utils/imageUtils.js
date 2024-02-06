export function descargarImagen(base64Image, format = "png") {
    //decodificamos la imagen de base64 a binario
    let imagenDecodificada = null
    try {
      imagenDecodificada = atob(base64Image)
    } catch (error) {
      console.log("error a decodificar ", error)
      return { error: "Error al decodificar la imagen en base64" }
    }
  
    // despues se convierte a un array de bytes
    const byteNumbers = new Array(imagenDecodificada.length);
    for (let i = 0; i < imagenDecodificada.length; i++) {
      byteNumbers[i] = imagenDecodificada.charCodeAt(i) //metodo charcodeat devuelve el codigo ascii de un caracter
    }
  
    const byteArray = new Uint8Array(byteNumbers);
  
    // Crear un objeto Blob con el array de bytes
    const blob = new Blob([byteArray], { type: `image/${format}` });
  
    const url = URL.createObjectURL(blob)
    console.log("url", url)
  
    return { url }
  
  
  }

export function obtenerNombreYextencionArchivo(nameFile) {
    const partes = nameFile.split(".")
    const extencion = partes[partes.length - 1]
  
    const name = [...partes.slice(0, partes.length - 1)].join("-")
  
    return { extencion, name }
  
  }