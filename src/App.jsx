import { useState } from 'react'
import './App.css'
import PianoLayout from './layouts/PianoLayout'
import DrumLayout from './layouts/DrumLayout'


function App() {
  const [activeLayout, setActiveLayout] = useState('piano')
  return (
    <>
    <button className='fixed top-3 lg:top-4 right-15 lg:right-17 w-9 h-9 lg:w-10 lg:h-10 flex justify-center items-center rounded-full bg-neutral-200 text-gray-600 shadow-lg hover:bg-neutral-400 transition-colors cursor-pointer z-10'
    onClick={()=>{activeLayout==='piano'? setActiveLayout('drum'): setActiveLayout('piano')}}
    
    >
        <img className='w-6 h-6' src={`${activeLayout==='piano'? './src/assets/drum-svgrepo-com.svg': './src/assets/piano-svgrepo-com.svg'}`} alt="" />
    </button>

     <div>
      {activeLayout==='piano'? <PianoLayout/> : <DrumLayout/>}
     </div>
    </>
  )
} 

export default App
