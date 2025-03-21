const sdk = require('microsoft-cognitiveservices-speech-sdk');

module.exports = async function (context, req) {
    // Handle CORS preflight requests (OPTIONS)
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',  // Allow all origins or specify as needed
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',  // Allowed methods
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'  // Allowed headers
            },
            body: ""
        };
        return;
    }

    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    // Handle missing speech key or region
    if (!speechKey || !speechRegion) {
        context.res = {
            status: 500,
            body: JSON.stringify({
                error: "Speech key or region is missing."
            })
        };
        return;
    }

    const action = req.query.action || (req.body && req.body.action);

    if (action === 'start') {
        try {
            // Configure Speech API
            const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
            const autoDetect = sdk.AutoDetectSourceLanguageConfig.fromLanguages(["en-US", "es-US", "es-ES", "hi-IN"]);
            const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();  // Correct microphone input method

            // Initialize SpeechRecognizer
            const speechRecognizer = sdk.SpeechRecognizer.FromConfig(speechConfig,autoDetect, audioConfig);


            // Start speech recognition and return result
            const result = await startSpeechRecognition(speechRecognizer);
            context.res = {
                status: 200,
                body: JSON.stringify(result)
            };
        } catch (error) {
            context.res = {
                status: 500,
                body: JSON.stringify({
                    error: `Error during speech recognition: ${error.message}`
                })
            };
        }
    } else if (action === 'stop') {
        try {
            const result = await stopSpeechRecognition();
            context.res = {
                status: 200,
                body: JSON.stringify(result)
            };
        } catch (error) {
            context.res = {
                status: 500,
                body: JSON.stringify({
                    error: `Error stopping recognition: ${error.message}`
                })
            };
        }
    } else {
        context.res = {
            status: 400,
            body: JSON.stringify({
                error: 'Invalid action. Use "start" or "stop".'
            })
        };
    }
};

async function startSpeechRecognition(speechRecognizer) {
    return new Promise((resolve, reject) => {
        
        this.speechRecognizer.sessionStarted = (s, e) => {
            console.log('Session Started');
        };

        speechRecognizer.recognizing = (s, e) => {
            console.log('Recognizing: ' + e.result.text);
        };

        speechRecognizer.recognizeOnceAsync();
        speechRecognizer.recognized = (s, e) => {
            console.log('Recognition Result: ' + e.result.text);
            const languageDetectionResult = sdk.AutoDetectSourceLanguageResult.fromResult(e.result);
            if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
                resolve({
                    text: e.result.text,
                    language: languageDetectionResult.language
                });
            }
        };

        speechRecognizer.canceled = (s, e) => {
            console.log('Recognition canceled: ' + e.errorDetails);
            reject(new Error('Recognition canceled: ' + e.errorDetails));
        };

        // Start continuous recognition
        
    });
}

async function stopSpeechRecognition() {
    return new Promise((resolve, reject) => {
        // Logic to stop the recognition (e.g., after a timeout or user command)
        try {
            resolve('Recognition stopped.');
        } catch (error) {
            reject(new Error('Error stopping recognition: ' + error.message));
        }
    });
}
