import React, { useEffect, useState } from 'react'

const piano = () => {

    const [activekey, SetactiveKey]= useState([])
    const [pressedkey, SetPressedKey] =useState(" ")

    const [isRecording, setIsRecording] = useState(false)
    const [recordedNotes, setRecordedNotes] = useState([])
    const [startTime , setStartTime]  =useState(null)

    const [isPlaying, setIsPlaying] =useState(false)


    const notes = {
        'a': new Audio('/sounds/key01.mp3'),
        'w': new Audio('/sounds/key02.mp3'),
        's': new Audio('/sounds/key03.mp3'),
        'e': new Audio('/sounds/key04.mp3'),
        'd': new Audio('/sounds/key05.mp3'),
        'f': new Audio('/sounds/key06.mp3'),
        'r': new Audio('/sounds/key07.mp3'),
        'g': new Audio('/sounds/key08.mp3'),
        't': new Audio('/sounds/key09.mp3'),
        'h': new Audio('/sounds/key10.mp3'),
        'y': new Audio('/sounds/key11.mp3'),
        'j': new Audio('/sounds/key12.mp3'),
        'k': new Audio('/sounds/key13.mp3'),
        'i': new Audio('/sounds/key14.mp3'),
        'l': new Audio('/sounds/key15.mp3'),
        'o': new Audio('/sounds/key16.mp3'),
        ';': new Audio('/sounds/key17.mp3'),
        "'": new Audio('/sounds/key18.mp3'),
        ']': new Audio('/sounds/key19.mp3'),
        'ent': new Audio('/sounds/key20.mp3'),
        '\\': new Audio('/sounds/key21.mp3'),
        '4': new Audio('/sounds/key22.mp3'),
        '7': new Audio('/sounds/key23.mp3'),
        '5': new Audio('/sounds/key24.mp3'),
    };

    const playNotes = (key) =>{
        if(notes[key]){
            notes[key].currentTime =0
            notes[key].play()
            
        }
        
    }

    const notesRecord = (key) =>{
            if(isRecording && notes[key] && startTime){
                const timestamp = Date.now() - startTime
                setRecordedNotes(prev=>[...prev, {key, timestamp}]
                )
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
    }, [isRecording])

    

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
        if(recordedNotes.length === 0) return

        setIsPlaying(true)

        recordedNotes.forEach(note => {
            setTimeout(()=>{
                playNotes(note.key)
            }, note.timestamp)
        })


        const lastNote = recordedNotes[recordedNotes.length-1]
        setTimeout(()=>{
            setIsPlaying(false)
        }, lastNote.timestamp + 100)
    }


  return (
    <>
    <div className='flex flex-col justify-center items-center'>
    <div className='flex justify-center pt-8 bg-white font-bold text-5xl w-30 h-30 border-8 border-amber-300'>
            {pressedkey.toUpperCase()}
    </div>

    {/* Piano Container */}
    <div className="flex relative">
        <div className="relative">
            <div id='a' className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('a') ? 'bg-pink-300' : 'bg-white'}`}  onClick={()=> handlekeyclicks('a')}>
                <div className='absolute bottom-0 left-4'>A</div>
            </div>
            <div id='w' className={`absolute z-10 rounded-b-lg w-8 h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('w') ? 'bg-pink-300' : 'bg-black'}`} onClick={()=> handlekeyclicks('w')}>
                <div className='text-white absolute bottom-0 left-2'>W</div>
            </div>
        </div>
        <div className="relative">
            <div id='s' className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('s') ? 'bg-pink-300' : 'bg-white'}`} onClick={()=> handlekeyclicks('s')}>
                <div className='absolute bottom-0 left-4'>S</div>
            </div>
            <div id='e' className={`absolute z-10 rounded-b-lg w-8 h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('e') ? 'bg-pink-300' : 'bg-black'}`} onClick={()=> handlekeyclicks('e')}>
                <div className='text-white absolute bottom-0 left-2'>E</div>
            </div>
        </div>

        <div id='d' className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('d') ? 'bg-pink-300' : 'bg-white'}`} onClick={()=> handlekeyclicks('d')}>
            <div className='absolute bottom-0 left-4'>D</div>
        </div>

        <div className="relative">
            <div id='f' className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('f') ? 'bg-pink-300' : 'bg-white'}`} onClick={()=> handlekeyclicks('f')}>
                <div className='absolute bottom-0 left-4'>F</div>
            </div>
            <div id='r' className={`absolute z-10 rounded-b-lg w-8 h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('r') ? 'bg-pink-300' : 'bg-black'}`} onClick={()=> handlekeyclicks('r')}>
                <div className='text-white absolute bottom-0 left-2'>R</div>
            </div>
        </div>

        <div className="relative">
            <div id='g' className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('g') ? 'bg-pink-300' : 'bg-white'}`} onClick={()=> handlekeyclicks('g')}>
                <div className='absolute bottom-0 left-4'>G</div>
            </div>
            <div id='t' className={`absolute z-10 rounded-b-lg w-8 h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('t') ? 'bg-pink-300' : 'bg-black'}`} onClick={()=> handlekeyclicks('t')}>
                <div className='text-white absolute bottom-0 left-2'>T</div>
            </div>
        </div>

        <div className="relative">
            <div id='h' className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('h') ? 'bg-pink-300' : 'bg-white'}`} onClick={()=> handlekeyclicks('h')}>
                <div className='absolute bottom-0 left-4'>H</div>
            </div>
            <div id='y' className={`absolute z-10 rounded-b-lg w-8 h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('y') ? 'bg-pink-300' : 'bg-black'}`} onClick={()=> handlekeyclicks('y')}>
                <div className='text-white absolute bottom-0 left-2'>Y</div>
            </div>
        </div>
        
        <div id='j' className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('j') ? 'bg-pink-300' : 'bg-white'}`} onClick={()=> handlekeyclicks('j')}>
            <div className='absolute bottom-0 left-4'>J</div>
        </div>

        <div className="relative">
            <div id='k' className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('k') ? 'bg-pink-300' : 'bg-white'}`} onClick={()=> handlekeyclicks('k')}>
                <div className='absolute bottom-0 left-4'>K</div>
            </div>
            <div id='i' className={`absolute z-10 rounded-b-lg w-8 h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('i') ? 'bg-pink-300' : 'bg-black'}`} onClick={()=> handlekeyclicks('i')}>
                <div className='text-white absolute bottom-0 left-2'>I</div>
            </div>
        </div>
        <div className="relative">
            <div id='l' className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('l') ? 'bg-pink-300' : 'bg-white'}`} onClick={()=> handlekeyclicks('l')}>
                <div className='absolute bottom-0 left-4'>L</div>
            </div>
            <div id='o' className={`absolute z-10 rounded-b-lg w-8 h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('o') ? 'bg-pink-300' : 'bg-black'}`} onClick={()=> handlekeyclicks('o')}>
                <div className='text-white absolute bottom-0 left-2'>O</div>
            </div>
        </div>

        <div id=';' className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive(';') ? 'bg-pink-300' : 'bg-white'}`} onClick={()=> handlekeyclicks(';')}>
            <div className='absolute bottom-0 left-4'>;</div>
        </div>

        <div className="relative">
            <div id="'" className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive("'") ? 'bg-pink-300' : 'bg-white'}`} onClick={()=> handlekeyclicks("'")}>
                <div className='absolute bottom-0 left-4'>'</div>
            </div>
            <div id=']' className={`absolute z-10 rounded-b-lg w-8 h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive(']') ? 'bg-pink-300' : 'bg-black'}`} onClick={()=> handlekeyclicks(']')}>
                <div className='text-white absolute bottom-0 left-2'>{']'}</div>
            </div>
        </div>

        <div className="relative">
            <div id='ent' className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('ent') ? 'bg-pink-300' : 'bg-white'}`} onClick={()=> handlekeyclicks('ent')}>
                <div className='absolute bottom-0 left-4'>ent</div>
            </div>
            <div id='\\' className={`absolute z-10 rounded-b-lg w-8 h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('\\') ? 'bg-pink-300' : 'bg-black'}`} onClick={()=> handlekeyclicks('\\')}>
                <div className='text-white absolute bottom-0 left-2'>\</div>
            </div>
        </div>

        <div className="relative">
            <div id='4' className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('4') ? 'bg-pink-300' : 'bg-white'}`} onClick={()=> handlekeyclicks('4')}>
                <div className='absolute bottom-0 left-4'>4</div>
            </div>
            <div id='7' className={`absolute z-10 rounded-b-lg w-8 h-32 top-0 -right-3 active:bg-pink-300 cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('7') ? 'bg-pink-300' : 'bg-black'}`} onClick={()=> handlekeyclicks('7')}>
                <div className='text-white absolute bottom-0 left-2'>7</div>
            </div>
        </div>
        
        <div id='5' className={`border-2 border-gray-500 w-12 h-48 rounded-b-lg active:bg-pink-300 relative cursor-pointer hover:bg-yellow-200 transition-colors duration-100 ${isActive('5') ? 'bg-pink-300' : 'bg-white'}`} onClick={()=> handlekeyclicks('5')}>
            <div className='absolute bottom-0 left-4'>5</div>
        </div>

    </div>

    {/* recorder */}
        <div className='flex justify-between space-x-10'>
                <div className='text-white font-bold cursor-pointer' onClick={startstoprecording}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </div>
                <div className='text-white font-bold cursor-pointer' onClick={playBack}>Playback</div>
        </div>
    </div>
    </>
  )
}

export default piano