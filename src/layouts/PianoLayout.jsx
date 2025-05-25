import React, { useEffect, useState } from 'react'
import Bgeffect from '../components/Bgeffect'

const PianoLayout = () => {

  const [darkMode, setDarkMode] = useState(true)

  useEffect(()=> {
    if(darkMode){
      document.documentElement.classList.add('dark')
    }
    else{
      document.documentElement.classList.remove('dark')
    }
  },[darkMode])

  const toggleDarkMode = () =>{
    setDarkMode(!darkMode)
  }

  return (
    <>
      <div className='min-h-screen bg-neutral-100 dark:bg-neutral-900 relative transition-colors duration-200 isolate'>
        <div className='absolute inset-0 -z-10'>
          <div className='absolute inset-0 dark:hidden' style={{backgroundImage : 'radial-gradient(rgba(0,0,0,0.13) 1px, transparent 1px', backgroundSize: '20px 20px',}}>
          </div>
          <div className='absolute inset-0 dark:block' style={{backgroundImage : 'radial-gradient(rgba(255,255,255,0.13) 1px, transparent 1px', backgroundSize: '20px 20px',}}>
          </div>
        </div>
        
        <button onClick={toggleDarkMode} className='fixed top-3 lg:top-4 right-3 lg:right-4 w-9 h-9 lg:w-10 lg:h-10 flex justify-center items-center rounded-full bg-amber-500 text-gray-600 shadow-lg hover:bg-amber-600 transition-colors cursor-pointer z-10'>
            <i className={`bx bx-${darkMode ? 'sun' : 'moon'} text-lg lg:text-xl`}></i>
        </button>
        <a target='_blank' className='fixed top-15 lg:top-17 lg:right-4 right-3 w-9 h-9 lg:w-10 lg:h-10 flex justify-center items-center rounded-full bg-neutral-300 shadow-lg hover:bg-white transition-colors cursor-pointer z-10' href="https://github.com/VIDIT45AGARWAL/CSOC_week1">
            <i className='bx bxl-github text-3xl lg:text-4xl'></i>
        </a>
        <Bgeffect darkMode={darkMode}/>
      </div>
      
    </>
  )
}

export default PianoLayout