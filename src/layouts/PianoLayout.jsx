import React, { useEffect, useState } from 'react'
import Bgeffect from '../components/Bgeffect'

const PianoLayout = () => {

  const [darkMode, setDarkMode] = useState(false)

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
      <div className='min-h-screen bg-neutral-100 dark:bg-neutral-900 relative transition-colors duration-200'>
        <button onClick={toggleDarkMode} className='fixed top-3 lg:top-4 right-3 lg:right-4 w-9 h-9 lg:w-10 lg:h-10 flex justify-center items-center rounded-full bg-amber-500 text-gray-600 shadow-lg hover:bg-amber-600 transition-colors cursor-pointer z-10'>
            <i className={`bx bx-${darkMode ? 'sun' : 'moon'} text-lg lg:text-xl`}></i>
        </button>
        <Bgeffect darkMode={darkMode}/>
      </div>
      
    </>
  )
}

export default PianoLayout