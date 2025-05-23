import React, { useEffect, useState, useRef } from 'react';

const piano = ({darkMode}) => {

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
        'a': '/sounds/key01.mp3',
        'w': '/sounds/key02.mp3',
        's': '/sounds/key03.mp3',
        'e': '/sounds/key04.mp3',
        'd': '/sounds/key05.mp3',
        'f': '/sounds/key06.mp3',
        'r': '/sounds/key07.mp3',
        'g': '/sounds/key08.mp3',
        't': '/sounds/key09.mp3',
        'h': '/sounds/key10.mp3',
        'y': '/sounds/key11.mp3',
        'j': '/sounds/key12.mp3',
        'k': '/sounds/key13.mp3',
        'i': '/sounds/key14.mp3',
        'l': '/sounds/key15.mp3',
        'o': '/sounds/key16.mp3',
        ';': '/sounds/key17.mp3',
        "'": '/sounds/key18.mp3',
        ']': '/sounds/key19.mp3',
        'ent': '/sounds/key20.mp3',
        '\\': '/sounds/key21.mp3',
        '4': '/sounds/key22.mp3',
        '7': '/sounds/key23.mp3',
        '5': '/sounds/key24.mp3',
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
                'a': 'a',
                'w': 'w',   
                's': 's',
                'e': 'e',
                'd': 'd',
                'f': 'f',
                'r': 'r',
                'g': 'g',
                't': 't',
                'h': 'h',
                'y': 'y',
                'j': 'j',
                'k': 'k',
                'i': 'i',
                'l': 'l',
                'o': 'o',
                ';': ';',
                "'": "'",
                ']': ']',
                'enter': 'ent',
                '\\': '\\',
                '4': '4',
                '7': '7',
                '5': '5'
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
                        'a': 'a',
                        'w': 'w',
                        's': 's',
                        'e': 'e',
                        'd': 'd',
                        'f': 'f',
                        'r': 'r',
                        'g': 'g',
                        't': 't',
                        'h': 'h',
                        'y': 'y',
                        'j': 'j',
                        'k': 'k',
                        'i': 'i',
                        'l': 'l',
                        'o': 'o',
                        ';': ';',
                        "'": "'",
                        ']': ']',
                        'enter': 'ent',
                        '\\': '\\',
                        '4': '4',
                        '7': '7',
                        '5': '5'
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
            noteBuffers['a'].numberOfChannels,
            totalDuration*noteBuffers['a'].sampleRate,
            noteBuffers['a'].sampleRate
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
    <div className='flex flex-col justify-center items-center'>
    <div className={`flex mt-3 justify-center pt-8 bg-transparent font-bold text-5xl w-30 text-${darkMode? 'white': 'black'} h-30 border-6 rounded-3xl border-transparent shadow-[0_0_10px_2px_rgba(251,191,36,0.8)] color-transition duration-200`}>
            {pressedkey.toUpperCase()}
    </div>

    {/* Piano Container */}
    <div className="mt-18 flex relative">
        <div className="relative">
            <div id='a' className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive('a') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('a')}>
                <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>A</div>
            </div>
            <div id='w' className={`absolute z-10 rounded-b-lg w-4 h-18 sm:w-6 sm:h-24 md:w-8 md:h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer transition-colors duration-100 ${isActive('w') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-black hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('w')}>
                <div className='text-white text-[10px] md:text-[16px] absolute bottom-0 left-1'>W</div>
            </div>
        </div>
        <div className="relative">
            <div id='s' className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive('s') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('s')}>
                <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>S</div>
            </div>
            <div id='e' className={`absolute z-10 rounded-b-lg w-4 h-18 sm:w-6 sm:h-24 md:w-8 md:h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer transition-colors duration-100 ${isActive('e') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-black hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('e')}>
                <div className='text-white text-[10px] md:text-[16px] absolute bottom-0 left-1'>E</div>
            </div>
        </div>
        <div id='d' className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive('d') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('d')}>
            <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>D</div>
        </div>
        <div className="relative">
            <div id='f' className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive('f') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('f')}>
                <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>F</div>
            </div>
            <div id='r' className={`absolute z-10 rounded-b-lg w-4 h-18 sm:w-6 sm:h-24 md:w-8 md:h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer transition-colors duration-100 ${isActive('r') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-black hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('r')}>
                <div className='text-white text-[10px] md:text-[16px] absolute bottom-0 left-1'>R</div>
            </div>
        </div>
        <div className="relative">
            <div id='g' className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive('g') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('g')}>
                <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>G</div>
            </div>
            <div id='t' className={`absolute z-10 rounded-b-lg w-4 h-18 sm:w-6 sm:h-24 md:w-8 md:h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer transition-colors duration-100 ${isActive('t') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-black hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('t')}>
                <div className='text-white text-[10px] md:text-[16px] absolute bottom-0 left-1'>T</div>
            </div>
        </div>
        <div className="relative">
            <div id='h' className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive('h') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('h')}>
                <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>H</div>
            </div>
            <div id='y' className={`absolute z-10 rounded-b-lg w-4 h-18 sm:w-6 sm:h-24 md:w-8 md:h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer transition-colors duration-100 ${isActive('y') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-black hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('y')}>
                <div className='text-white text-[10px] md:text-[16px] absolute bottom-0 left-1'>Y</div>
            </div>
        </div>
        <div id='j' className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive('j') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('j')}>
            <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>J</div>
        </div>
        <div className="relative">
            <div id='k' className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive('k') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('k')}>
                <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>K</div>
            </div>
            <div id='i' className={`absolute z-10 rounded-b-lg w-4 h-18 sm:w-6 sm:h-24 md:w-8 md:h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer transition-colors duration-100 ${isActive('i') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-black hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('i')}>
                <div className='text-white text-[10px] md:text-[16px] absolute bottom-0 left-1'>I</div>
            </div>
        </div>
        <div className="relative">
            <div id='l' className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive('l') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('l')}>
                <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>L</div>
            </div>
            <div id='o' className={`absolute z-10 rounded-b-lg w-4 h-18 sm:w-6 sm:h-24 md:w-8 md:h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer transition-colors duration-100 ${isActive('o') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-black hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('o')}>
                <div className='text-white text-[10px] md:text-[16px] absolute bottom-0 left-1'>O</div>
            </div>
        </div>
        <div id=';' className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive(';') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks(';')}>
            <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>;</div>
        </div>
        <div className="relative">
            <div id="'" className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive("'") ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks("'")}>
                <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>'</div>
            </div>
            <div id=']' className={`absolute z-10 rounded-b-lg w-4 h-18 sm:w-6 sm:h-24 md:w-8 md:h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer transition-colors duration-100 ${isActive(']') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-black hover:bg-amber-300'}`} onClick={()=> handlekeyclicks(']')}>
                <div className='text-white text-[10px] md:text-[16px] absolute bottom-0 left-1'>{']'}</div>
            </div>
        </div>
        <div className="relative">
            <div id='ent' className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive('ent') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('ent')}>
                <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>ent</div>
            </div>
            <div id='\\' className={`absolute z-10 rounded-b-lg w-4 h-18 sm:w-6 sm:h-24 md:w-8 md:h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer transition-colors duration-100 ${isActive('\\') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-black hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('\\')}>
                <div className='text-white text-[10px] md:text-[16px] absolute bottom-0 left-1'>\</div>
            </div>
        </div>
        <div className="relative">
            <div id='4' className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive('4') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('4')}>
                <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>4</div>
            </div>
            <div id='7' className={`absolute z-10 rounded-b-lg w-4 h-18 sm:w-6 sm:h-24 md:w-8 md:h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer transition-colors duration-100 ${isActive('7') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-black hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('7')}>
                <div className='text-white text-[10px] md:text-[16px] absolute bottom-0 left-1'>7</div>
            </div>
        </div>
        <div id='5' className={`border-2 border-gray-500 w-6 h-24 sm:w-8 sm:h-32 md:w-12 md:h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer transition-colors duration-100 ${isActive('5') ? 'bg-pink-300 shadow-[0_0_15px_2px_rgba(236,72,153,0.8)]' : 'bg-white hover:bg-amber-300'}`} onClick={()=> handlekeyclicks('5')}>
            <div className='absolute bottom-0 left-1 text-[10px] md:text-[16px]'>5</div>
        </div>
    </div>

    {/* recorder */}

    <div>
        <div className='flex justify-between space-x-10 mt-25'>
                <div className={`px-4 py-2 rounded-md text-[9px] sm:text-[13px] md:text-[16px] font-bold cursor-pointer transition-color ${isRecording ? 'bg-white text-red-600 shadow-[0_0_10px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_0_15px_3px_rgba(255,255,255,0.9)]' : 'bg-gray-200 text-gray-800 shadow-[0_0_10px_2px_rgba(192,192,192,0.6)] hover:shadow-[0_0_15px_3px_rgba(192,192,192,0.8)]'} flex items-center`} onClick={startstoprecording}>
                    {isRecording ? (<><span className='inline-block w-3 h-3  bg-red-600 rounded-full mr-2 animate-pulse'></span> Stop Recording</>) : "Start Recording"}
                </div>

                <div className={`px-4 py-2 text-[9px] sm:text-[13px] md:text-[16px] rounded-md font-bold cursor-pointer transition-colors flex items-center ${isPlaying ? 'bg-amber-400 text-white shadow-[0_0_15px_3px_rgba(245,158,11,0.7)]': 'bg-amber-400 text-white shadow-[0_0_10px_2px_rgba(245,158,11,0.5)] hover:shadow-[0_0_15px_3px_rgba(245,158,11,0.7)]'}`} onClick={playBack}>
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
        </div>
    </>
  )
}

export default piano