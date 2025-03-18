const sdk = require("microsoft-cognitiveservices-speech-sdk");

module.exports = async function (context, req) {
    try {
        context.log("Azure Speech Translation Function Triggered.");

        // Ensure environment variables are set
        if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
            context.log.error("Missing SPEECH_KEY or SPEECH_REGION in environment variables.");
            context.res = {
                status: 500,
                body: "Server configuration error: Missing API key or region."
            };
            return;
        }

        // Initialize Speech Translation Config
        const speechConfig = sdk.SpeechTranslationConfig.fromSubscription(
            process.env.AZURE_SPEECH_KEY,
            process.env.AZURE_SPEECH_REGION
        );

        // Configure input and output languages
        speechConfig.speechRecognitionLanguage = "en-US"; // Input language
        speechConfig.addTargetLanguage("fr"); // Translate to French (Change as needed)

        // Set up microphone input
        const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

        // Create the speech translation recognizer
        const recognizer = new sdk.TranslationRecognizer(speechConfig, audioConfig);

        context.log("Listening... Speak now!");

        // Handle recognizing event (partial results)
        recognizer.recognizing = (s, e) => {
            context.log(`Recognizing: ${e.result.text}`);
        };

        // Handle recognized event (final result)
        recognizer.recognized = async (s, e) => {
            if (e.result.reason === sdk.ResultReason.TranslatedSpeech) {
                const originalText = e.result.text;
                const translatedText = e.result.translations.get("fr"); // Get French translation

                context.log(`Original Speech: ${originalText}`);
                context.log(`Translated Speech: ${translatedText}`);

                // Respond with translation result
                context.res = {
                    status: 200,
                    body: JSON.stringify({
                        original: originalText,
                        translated: translatedText
                    })
                };

                // Stop recognition
                recognizer.stopContinuousRecognitionAsync();
            }
        };

        // Handle errors
        recognizer.canceled = (s, e) => {
            context.log.error(`Speech Recognition Canceled: ${e.reason}`);
            if (e.errorDetails) {
                context.log.error(`Error Details: ${e.errorDetails}`);
            }
        };

        // Start real-time recognition
        recognizer.startContinuousRecognitionAsync();
    } catch (error) {
        context.log.error("Unexpected Error: ", error);
        context.res = {
            status: 500,
            body: "Error processing speech translation."
        };
    }
};
