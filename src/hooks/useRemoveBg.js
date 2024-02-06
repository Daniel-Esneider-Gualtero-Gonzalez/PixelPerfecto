import { useState } from "react"
import { API_KEY } from "../components/DragandDrop"


function useRemoveBg() {
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)
    const [result,setResult] = useState(null)

    const removeBg = async (formData)=>{
        try {
            setLoading(true)
            const response = await fetch("https://techhk.aoscdn.com/api/tasks/visual/segmentation", {
              method: "POST",
              headers: {
                "X-API-KEY": API_KEY,
              },
              body: formData,
            });
            
            // if(!response.ok) return setError("error al remover el bg")
            const responseBody = await response.json();

            console.log("response",response)
      
            return setResult("data:image/png;base64," + responseBody.data.image)
      
      
          } catch (error) {
            setError("error al remover el fondo de la imagen", error);
          } finally{
            setLoading(false)
          }
    }
  return {
    loading,error,result,removeBg

  }
}

export default useRemoveBg