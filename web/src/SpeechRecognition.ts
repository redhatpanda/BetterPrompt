/* eslint-disable @typescript-eslint/no-explicit-any */
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'

const speechKey = import.meta.env.VITE_SPEECH_KEY;
const speechRegion = import.meta.env.VITE_SPEECH_REGION;

export default class SpeechRecognition {
    speechConfig: sdk.SpeechConfig
    autoDetect: sdk.AutoDetectSourceLanguageConfig
    speechRecognizer: sdk.SpeechRecognizer
    textOutput: string
    audioConfig: sdk.AudioConfig
    public isRecognised: boolean

    constructor() {
        this.speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
        this.autoDetect = sdk.AutoDetectSourceLanguageConfig.fromLanguages(["en-US", "es-US", "es-ES", "hi-IN"]);
        this.audioConfig = sdk.AudioConfig.fromMicrophoneInput();
        this.speechRecognizer = sdk.SpeechRecognizer.FromConfig(this.speechConfig, this.autoDetect, this.audioConfig);
        this.isRecognised = false;
        this.textOutput = "";
    }

    startSpeechRecognition(onResult: (text: string, isFinal?: boolean) => void) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.speechRecognizer.sessionStarted = (_s: sdk.Recognizer, _e: sdk.SessionEventArgs) => {
            console.log('Session Started');
            
        };

        this.speechRecognizer.recognizing = (_s: sdk.Recognizer, e: sdk.SpeechRecognitionEventArgs) => {
            console.log('Recognizing: ', e.result.text);
            onResult(e.result.text, false); 
        };

        this.speechRecognizer.recognized = (_s: sdk.Recognizer, e: sdk.SpeechRecognitionEventArgs) => {
            if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
                console.log('Final Recognized Speech: ', e.result.text);
                onResult(e.result.text, false); 
            }
        };

        this.speechRecognizer.canceled = (_s: sdk.Recognizer, e: sdk.SpeechRecognitionCanceledEventArgs) => {
            console.error('Recognition canceled: ', e.errorDetails);
            onResult('Error in recognition: ' + e.errorDetails); 
            this.stopSpeechRecognition(); 
        };

        
        this.speechRecognizer.startContinuousRecognitionAsync();
    }

    stopSpeechRecognition() {
      
        this.speechRecognizer.stopContinuousRecognitionAsync(
            () => {
                console.log('Session stopped successfully');
            },
            (err: any) => {
                console.error('Error stopping recognition: ', err);
            }
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.speechRecognizer.sessionStopped = (_s: sdk.Recognizer, _e: any) => {
            console.log('Session Stopped');
        };
    }
}
