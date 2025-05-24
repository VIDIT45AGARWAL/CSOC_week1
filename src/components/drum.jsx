import React, { useEffect, useState, useRef } from 'react';

const Drum = ({darkMode}) => {
        const [activekey, SetactiveKey]= useState([])
        const [pressedkey, SetPressedKey] =useState(" ")
    
        const [isRecording, setIsRecording] = useState(false)
        const [recordedNotes, setRecordedNotes] = useState([])
        const [startTime , setStartTime]  =useState(null)
    
        const [isPlaying, setIsPlaying] =useState(false)
    
        const [noteBuffers, setNoteBuffers] =useState({})
        const [isLoaded, setIsLoaded] =useState(false)
        const audioContext =useRef(null)

        const noteFiles = {
        '4': '/drumsounds/acoustic-snare.mp3',
        '5': '/drumsounds/bass-drum-1.mp3',
        '6': '/drumsounds/chinese-cymbal.mp3',
        '7': '/drumsounds/electric-snare.mp3',
        'r': '/drumsounds/crash-cymbal-1.mp3',
        't': '/drumsounds/crash-cymbal-2.mp3',
        'y': '/drumsounds/high-floor-tom.mp3',
        'u': '/drumsounds/high-tom.mp3',
        'f': '/drumsounds/low-floor-tom.mp3',
        'g': '/drumsounds/low-mid-tom.mp3',
        'h': '/drumsounds/low-tom.mp3',
        'j': '/drumsounds/open-hihat.mp3',
        'n': '/drumsounds/ride-bell.mp3',
        'm': '/drumsounds/ride-cymbal-1.mp3',
        'v': '/drumsounds/side-stick.mp3',
        'b': '/drumsounds/splash-cymbal.mp3',
        };


    useEffect(()=>{
            audioContext.current= new AudioContext();
            const loadBuffers = async ()=>{
                const buffers ={};
                try{
                    for(const [key, file] of Object.entries(noteFiles)){
                        const response = await fetch(file)
                        const arrayBuffer = await response.arrayBuffer()
                        const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer)
                        buffers[key] = audioBuffer
                    }
                    setNoteBuffers(buffers)
                    setIsLoaded(true)
                }
                catch(error){
                    console.error('Error in loading audio buffers:', error)
                }
            }
            loadBuffers()
    
            return() =>{
                if(audioContext.current){
                    audioContext.current.close()
                }
            }
        },[])

    const playNotes = (key) =>{
        const buffer =noteBuffers[key]
        if(buffer && audioContext.current){
            const source = audioContext.current.createBufferSource()
            source.buffer=buffer
            source.connect(audioContext.current.destination)
            source.start()
        }
        else{
            console.warn(`No buffer found for: ${key}`)
        }
    }


    const notesRecord = (key) =>{
            if(isRecording && startTime){
                const timestamp = Date.now() - startTime
                setRecordedNotes((prev)=>[...prev, {key, timestamp}])
            }
    }

    useEffect(()=>{
            const handleKeyDown =(e) =>{
                const key=e.key.toLowerCase()
                console.log("key pressed", key, "isRecording", isRecording)
                const keyMap = {
                    '4': '4',
                    '5': '5',   
                    '6': '6',
                    '7': '7',
                    'r': 'r',
                    't': 't',
                    'y': 'y',
                    'u': 'u',
                    'f': 'f',
                    'g': 'g',
                    'h': 'h',
                    'j': 'j',
                    'v': 'v',
                    'b': 'b',
                    'n': 'n',
                    'm': 'm',
                }

                const mkey = keyMap[key]
                if(mkey){
                    playNotes(mkey)
                    if(isRecording){
                        notesRecord(mkey)
                    }
                    SetactiveKey(prev => prev.includes(mkey)? prev : [...prev, mkey])
                    SetPressedKey(mkey)
                }
            }
    
    
            const handleKeyUp = (e)=>{
                            const key = e.key.toLowerCase()
                            const keyMap = {
                                '4': '4',
                                '5': '5',   
                                '6': '6',
                                '7': '7',
                                'r': 'r',
                                't': 't',
                                'y': 'y',
                                'u': 'u',
                                'f': 'f',
                                'g': 'g',
                                'h': 'h',
                                'j': 'j',
                                'v': 'v',
                                'b': 'b',
                                'n': 'n',
                                'm': 'm',
                            }

                        
                        const mkey= keyMap[key]
                        if(mkey){
                            SetactiveKey(prev => prev.filter(k=> k !== mkey))
                        }
                    }
    
    
            window.addEventListener('keydown',handleKeyDown)
            window.addEventListener('keyup',handleKeyUp)
    
            return ()=>{
                window.removeEventListener('keydown',handleKeyDown)
                window.removeEventListener('keyup', handleKeyUp)
            }
        }, [isRecording, noteBuffers])

        const handlekeyclicks=(note)=>{
        playNotes(note)
        if(isRecording){
            notesRecord(note)
        }
        SetPressedKey(note)
    }

    const isActive = (key) => activekey.includes(key)

    const startstoprecording =()=>{
        if(!isRecording){
            setStartTime(Date.now())
            setRecordedNotes([])
            setIsRecording(true)
        }
        else{
            setIsRecording(false)
            setStartTime(null)
        }
    }


    const playBack = () =>{
        if(recordedNotes.length === 0 || !isLoaded) return

        setIsPlaying(true)
        const startTime=audioContext.current.currentTime
        recordedNotes.forEach(note => {
            const buffer =noteBuffers[note.key]
            if(buffer){
                const source= audioContext.current.createBufferSource()
                source.buffer=buffer
                source.connect(audioContext.current.destination)
                source.start(startTime + note.timestamp/1000)
            }
        })
        const lastNote = recordedNotes[recordedNotes.length-1]
        const lastNoteduration= noteBuffers[lastNote.key]?.duration ||1
        const endtime= startTime+lastNote.timestamp/1000 + lastNoteduration
        const delay= (endtime-audioContext.current.currentTime)*1000
        setTimeout(()=> setIsPlaying(false), delay)
    }


    const audioBuffertoWav = (buffer) =>{
        const numOfChan =buffer.numberOfChannels
        const length =buffer.length*numOfChan*2 +44
        const bufferArray=new ArrayBuffer(length)
        const view =new DataView(bufferArray)
        const channels=[]
        let offset=0
        let pos=0

        const setUint16=(data)=>{
            view.setUint16(pos,data,true)
            pos+=2
        }
        const setUint32=(data)=>{
            view.setUint32(pos, data, true)
            pos+=4
        }

        setUint32(0x46464952); 
        setUint32(length - 8); 
        setUint32(0x45564157); 
        setUint32(0x20746d66); 
        setUint32(16); 
        setUint16(1); 
        setUint16(numOfChan);
        setUint32(buffer.sampleRate);
        setUint32(buffer.sampleRate * numOfChan * 2); 
        setUint16(numOfChan * 2); 
        setUint16(16); 
        setUint32(0x61746164); 
        setUint32(length - pos - 4);

        for(let i=0;i<buffer.numberOfChannels;i++){
            channels.push(buffer.getChannelData(i))
        }
        while(pos<length){
            for(let i=0;i<numOfChan;i++){
                let sample=channels[i][offset]
                sample=Math.max(-1, Math.min(1, sample))
                sample=(sample<0? sample* 0x8000 : sample * 0x7FFF) | 0
                view.setInt16(pos, sample, true)
                pos+=2
            }
            offset++
        }
        return bufferArray
    }


    const downloadPlayback = async() =>{
        if(!isLoaded || recordedNotes.length===0) return

        const totalDuration =Math.max(...recordedNotes.map(note=>
            note.timestamp/1000 + (noteBuffers[note.key]?.duration ||1)
        ))

        const offlineContext = new OfflineAudioContext(
            noteBuffers['4'].numberOfChannels,
            totalDuration*noteBuffers['4'].sampleRate,
            noteBuffers['4'].sampleRate
        )

        recordedNotes.forEach(note =>{
            const buffer = noteBuffers[note.key]
            if(buffer){
                const source=offlineContext.createBufferSource()
                source.buffer=buffer
                source.connect(offlineContext.destination)
                source.start(note.timestamp/1000)
            }
        })

        const renderedBuffer = await offlineContext.startRendering();
        const wavData = audioBuffertoWav(renderedBuffer);
        const blob = new Blob([wavData], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'playback.wav';
        a.click();
        URL.revokeObjectURL(url); 
    }


  return (
    <>
    <div className='h-24 overflow-y-auto m-3 border-6 rounded-3xl border-transparent shadow-[0_0_10px_2px_rgba(251,191,36,0.8)] scrollbar-thin scrollbar-thumb-amber-700 dark:scrollbar-thumb-amber-300 scrollbar-track-transparent'>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-1 p-1'>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Acoustic Snare: 4</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Bass Drum: 5</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Chinese Cymbal: 6</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Electric Snare: 7</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Crash-Cymbal 1: R</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Crash-Cymbal 2: T</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>High Floor Tom: Y</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>High Tom: U</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Low Floor Tom: F</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Low Mid Tom: G</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Low Tom: H</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Open Hihat: J</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Side Sticks: V</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Splash Cymbal: B</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Ride-bell: N</div>
            <div className='text-amber-700 dark:text-amber-400 bg-transparent p-2 rounded'>Ride-Cymbal: M</div>
        </div>
    </div>
    
    {/* Drum Box */}
    <div className='mt-3'>
     <div className="flex flex-row justify-between items-center  m-1 mb-4">
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('4') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('4')}>Acoutic Snare</div>
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('5') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('5')}>Bass Drum</div>
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('6') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('6')}>Chinese Cymbal</div>
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('7') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('7')}>Electric Snare</div>
     </div>

     <div className="flex flex-row justify-between items-center m-1 mb-4">
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('r') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('r')}>Crash-Cymbal 1</div>
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('t') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('t')}>Crash-Cymbal 2</div>
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('y') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('y')}>High Floor Tom</div>
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('u') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('u')}>High Tom</div>
     </div>

     <div className="flex flex-row justify-between items-center m-1 mb-4">
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('f') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('f')}>Low Floor Tom</div>
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('g') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('g')}>Low Mid Tom</div>
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('h') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('h')}>Low Tom</div>
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('j') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('j')}>Open Hihat</div>
     </div>

     <div className="flex flex-row justify-between items-center m-1 mb-4">
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('v') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('v')}>Side Sticks</div>
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('b') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('b')}>Splash Cymbal</div>
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('n') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('n')}>Ride-bell</div>
        <div className={`text-amber-700 dark:text-amber-100 select-none md:text-[16px] sm:text-[10px] text-[9px] flex justify-center active:text-amber-300 active:scale-95 active:bg-amber-300/20 items-center border-2 border-amber-700 dark:border-amber-100 transition-all duration-100 rounded-2xl p-6 w-23 h-15 sm:w-25 md:w-42 sm:h-12 md:h-18 ${isActive('m') ? 'text-amber-300 scale-95 border-amber-300 bg-amber-300/20' : 'bg-transparent hover:border-amber-300 cursor-pointer'}`} onClick={()=>handlekeyclicks('m')}>Ride-Cymbal</div>
     </div>
    </div>


    {/* recorder */}

    <div>
        <div className='flex justify-evenly mt-6'>
                <div className={`px-4 py-2 rounded-md text-[9px] sm:text-[13px] md:text-[16px] font-bold cursor-pointer transition-color ${isRecording ? 'bg-white text-red-600 shadow-[0_0_10px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_0_15px_3px_rgba(255,255,255,0.9)]' : 'bg-gray-200 text-gray-800 shadow-[0_0_10px_2px_rgba(192,192,192,0.6)] hover:shadow-[0_0_15px_3px_rgba(192,192,192,0.8)]'} flex items-center`} onClick={startstoprecording}>
                    {isRecording ? (<><span className='inline-block w-3 h-3  bg-red-600 rounded-full mr-2 animate-pulse'></span> Stop Recording</>) : "Start Recording"}
                </div>

                <div className={`px-4 py-2 text-[9px] sm:text-[13px] md:text-[16px] rounded-md font-bold cursor-pointer transition-colors flex items-center ${isPlaying ? 'bg-amber-400 text-white shadow-[0_0_15px_3px_rgba(245,158,11,0.7)]': 'bg-amber-400 text-white shadow-[0_0_10px_2px_rgba(245,158,11,0.5)] hover:shadow-[0_0_15px_3px_rgba(245,158,11,0.7)]'}`} onClick={()=>{if(!isPlaying) playBack()}}>
                    {isPlaying ? (
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                        >
                        <path 
                            fillRule="evenodd" 
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" 
                            clipRule="evenodd" 
                        />
                        </svg>
                    ) : (
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                        >
                        <path 
                            fillRule="evenodd" 
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" 
                            clipRule="evenodd" 
                        />
                        </svg>
                    )}
                    Playback
                    </div>

                    <div className={`px-4 py-2 text-[9px] sm:text-[13px] md:text-[16px] rounded-md font-bold cursor-pointer transition-colors flex items-center ${recordedNotes.length === 0 || !isLoaded? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-500 text-white shadow-[0_0_15px_3px_rgba(59,130,246,0.8)] hover:shadow-[0_0_20px_4px_rgba(59,130,246,0.9)]'}`} onClick={downloadPlayback}>
                        Download
                    </div>
                </div>
            </div>
     </>
  );
};

export default Drum;