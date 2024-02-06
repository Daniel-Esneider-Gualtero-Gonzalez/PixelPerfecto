
import { BrowserRouter,Routes,Route, } from 'react-router-dom'
import DragAndDrop from './components/DragandDrop'
import RemoveBg from './pages/RemoveBg'
import SelectService from './pages/Services'


function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<DragAndDrop />} />
        <Route path='/services' element={ <SelectService />}/>
        <Route path='/removeBg' element={<RemoveBg />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
