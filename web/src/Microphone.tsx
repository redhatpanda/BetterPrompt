import  { useState, useEffect,  } from 'react'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import { Container, IconButton } from '@mui/material'
import SpeechRecognition from './SpeechRecognition'

function Microphone({
    setTranscript,
    setIsFinal,
    
}: {
    setTranscript: (v:string) => void
    setIsFinal: (v:boolean) => void
    
}) {
    const [isListening, setIsListening] = useState(false)
    const [speechRecognizer] = useState(new SpeechRecognition())

    useEffect(() => {
        const handleResult = (text: string,isFinal?:boolean) => {
            setTranscript(text);
            setIsFinal(isFinal as boolean);
            if(isFinal)
            setIsListening(false);
        };

        if (isListening) {
            speechRecognizer.startSpeechRecognition(handleResult);
        } else {
            speechRecognizer.stopSpeechRecognition();
        }

        
    }, [isListening, setIsFinal, setTranscript, speechRecognizer]);
    return (
        <Container>
            <IconButton
                aria-label="mic"
                style={{ backgroundColor: '#3086D5', color: 'white' }}
                size="large"
                onClick={() => {
                    setIsListening(!isListening)}}
            >
                {isListening ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
        </Container>
    )
}

export default Microphone
