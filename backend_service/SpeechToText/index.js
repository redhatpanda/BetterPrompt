const { SpeechConfig, AudioConfig, SpeechRecognizer } = require("microsoft-cognitiveservices-speech-sdk");

module.exports = async function (context, req) {
    try {
        if (req.method !== "POST") {
            context.res = { status: 405, body: "Only POST requests are allowed." };
            return;
        }

        if (!req.body || !Buffer.isBuffer(req.body)) {
            context.res = { status: 400, body: "No audio data received or invalid format." };
            return;
        }

        // Azure Speech Service Configuration
        const speechConfig = SpeechConfig.fromSubscription("YOUR_AZURE_SPEECH_KEY", "YOUR_REGION");
        const audioConfig = AudioConfig.fromWavFileInput(req.body); // Directly use the buffer

        const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizeOnceAsync((result) => {
            context.res = { status: 200, body: result.text || "No speech detected." };
        });
    } catch (error) {
        context.res = { status: 500, body: `Error: ${error.message}` };
    }
};
