import React, { useState } from 'react'

const recorder = ({notes, playNote}) => {

    const [isRecording, setIsRecording] = useState(false)
    const [recordedNotes, setRecordedNotes] = useState([])
    const [startTime , setStartTime]  =useState(null)
    const [isPlaying, setIsPlaying] =useState(false)
    const [recordingName, setRecordingName] =useState("")

    const controlRecording = () =>{
        if(!isRecording){
            setStartTime(Date.now())
            setRecordedNotes([])
            setIsRecording(true)
        }
        else{
            setIsRecording(false)
        }
    }

    const notesRecording = (key) =>{
        if(isRecording && notes[key]){
            const timestamp = Date.now() - startTime
            setRecordedNotes(prev=> [...prev, {key, timestamp}])
        }
    }


    const playback = () =>{
        if(recordedNotes.length ===0 || isPlaying){
            return
        }
        setIsPlaying(true)
        recordedNotes.forEach((note,index)=>{
            setTimeout(()=>{
                playNote(note.key)
                if(index === recordedNotes.length-1){
                    setTimeout(()=> setIsPlaying(false),100)
                }
            },note.timestamp)
        })
    }

  return (
    // button container
    <div className="recorder-controls p-4 bg-gray-100 rounded-lg mb-4">
      <h2 className="text-xl font-bold mb-3">Recording Studio</h2>
      
      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={controlRecording}
          className={`px-4 py-2 rounded ${isRecording ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          {isRecording ? (
            <span className="flex items-center">
              <span className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></span>
              Recording...
            </span>
          ) : 'Start Recording'}
        </button>

        <button
          onClick={pla}
          disabled={recordedNotes.length === 0 || isPlaying}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {isPlaying ? 'Playing...' : 'Playback'}
        </button>

        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={recordingName}
            onChange={(e) => setRecordingName(e.target.value)}
            placeholder="Name your recording"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          disabled={recordedNotes.length === 0}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-400"
        >
          Save Recording
        </button>
      </div>

      {recordedNotes.length > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          Recorded {recordedNotes.length} notes ({Math.round(recordedNotes[recordedNotes.length - 1].timestamp / 1000)}s)
        </div>
      )}
    </div>
  )
}

export default recorder