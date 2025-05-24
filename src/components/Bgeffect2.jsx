import React from 'react'
import Piano from './piano.jsx'
import Drum from './drum.jsx'

const Bgeffect = ({darkMode}) => {
  return (
    <>
    <div className='isolate'>
        <div className='absolute inset-0 -z-10 '>
            <div className='absolute top-0 -left-1/4 w-1/2 h-1/2 bg-amber-400  dark:bg-amber-500 rounded-full blur-3xl opacity-30'></div>
        </div>
        <div className='container mx-auto px-6 py-20 md:py-24 lg:py-28 xl:py-32'>
      <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16'>
          <div className='flex-1 space-y-6 lg:space-y-7'>
            {/*  */}
            <div className='flex flex-col items-center xl:items-start xl:flex-row space-y-4 lg:space-y-5'>
                <div className='flex flex-col items-center xl:block'>
                  <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center xl:text-left font-extrabold tracking-tight text-neutral-900 dark:text-white'>
                  <span className='block mb-1'>Virtual</span>
                  <span className='bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600'>Drum </span>
                </h1>
                <p className='text-base mt-8 lg:text-lg text-center xl:text-left text-neutral-600 dark:text-neutral-300 max-w-100 font-light '>
                  A dynamic 16-pad drum machine with real-time playback, step sequencing, and recording capabilities – perfect for crafting beats on the fly.
                </p>

                <div className='mt-13 w-80 mb-8'>
                  <h2 className='text-amber-400 text-2xl font-bold'>Instructions:</h2>
                  <div className='flex flex-row space-x-3'>
                    <div>
                        <i className='bx bxs-chevrons-right' style={{color: '#f8a407'}}  ></i>
                    </div>
                    <div>
                        <p className='text-neutral-700 dark:text-neutral-200 color-transition'>
                          Piano can be played both from clicks and keyboards
                        </p>
                    </div>
                  </div>
                  <div className='flex flex-row space-x-3'>
                    <div>
                      <i className='bx bxs-chevrons-right' style={{color: '#f8a407'}}  ></i>
                    </div>
                    <div>
                      <p className='text-neutral-700 dark:text-neutral-200 color-transition'>
                        For darkmode use the button at the top corner
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-row space-x-3'>
                    <div>
                      <i className='bx bxs-chevrons-right' style={{color: '#f8a407'}}  ></i>
                    </div>
                    <div>
                      <p className='text-neutral-700 dark:text-neutral-200 color-transition'>
                        To record your tune use the Start Recording button and then play your tune, when you are done Stop the recording and you can listen to your recorded tune using the Playback button
                      </p>
                    </div>
                  </div>
                </div>
                </div>   
                
                  <div className='flex flex-col relative bg-white dark:bg-neutral-900 h-150 w-100 sm:w-120 md:w-180 gb:w-220 xl:ml-50 border-8 border-transparent shadow-[0_0_40px_6px_rgba(251,191,36,0.8)] rounded-2xl' >
                    <Drum darkMode={darkMode}/> 
                  </div>
            </div>
          </div>  
      </div>
    </div>
    </div>
    </>
  )
}

export default Bgeffect