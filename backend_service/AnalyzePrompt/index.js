const axios = require("axios");

module.exports = async function (context, req) {
    const prompt = req.body.prompt;

    if (!prompt) {
        context.res = { status: 400, body: "Prompt is required" };
        return;
    }

    try {
        // Step 1: Detect Language and Script Using OpenAI
        const languageResponse = await axios.post(
            `${process.env.OPENAI_ENDPOINT}/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview`,
            {
                messages: [
                    { role: "system", content: "Identify the language of the given text. If the text is written in a non-English language but using English script (e.g., Bengali, Hindi, Urdu in Latin script), detect it and provide the actual language." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 50,
                temperature: 0.3
            },
            { headers: { "api-key": process.env.OPENAI_API_KEY } }
        );

        const detectedLanguage = languageResponse.data.choices[0].message.content.trim();

        let translatedPrompt = prompt;

        if (detectedLanguage !== "English") {
            // Step 2: Translate Non-English Text to English (Using OpenAI)
            const translationResponse = await axios.post(
                `${process.env.OPENAI_ENDPOINT}/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview`,
                {
                    messages: [
                        { role: "system", content: `Translate this text into English while preserving its original intent. Original language detected: ${detectedLanguage}.` },
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 400,
                    temperature: 0.5
                },
                { headers: { "api-key": process.env.OPENAI_API_KEY } }
            );

            translatedPrompt = translationResponse.data.choices[0].message.content.trim();
        }

        // Step 3: Analyze Context (Fix Ambiguities)
        const contextAnalysisResponse = await axios.post(
            `${process.env.OPENAI_ENDPOINT}/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview`,
            {
                messages: [
                    { role: "system", content: "Analyze this prompt and identify any ambiguities. Provide a more specific, well-formed version of the same prompt." },
                    { role: "user", content: translatedPrompt }
                ],
                max_tokens: 400,
                temperature: 0.7
            },
            { headers: { "api-key": process.env.OPENAI_API_KEY } }
        );
        const clarifiedPrompt = contextAnalysisResponse.data.choices[0].message.content.trim();

        // Step 4: Run Content Safety Check (NSFW, Violence, Hate Speech)
        const moderationResponse = await axios.post(
            `${process.env.CONTENT_SAFETY_ENDPOINT}/contentsafety/text:analyze?api-version=2023-10-01`,
            { text: clarifiedPrompt, categories: ["Hate", "Sexual", "Violence", "SelfHarm"] },
            { headers: { "Ocp-Apim-Subscription-Key": process.env.CONTENT_SAFETY_API_KEY } }
        );
        const flaggedCategories = moderationResponse.data.categoriesAnalysis
            .filter((cat) => cat.severity > 1)
            .map((cat) => cat.category);

        let rephraseInstruction = "Ensure this prompt is clear, specific, and well-defined.";
        if (flaggedCategories.length > 0) {
            rephraseInstruction += " Remove any NSFW, biased, racist, or inappropriate content while keeping the meaning intact.";
        }

        // Step 5: Final Rephrasing to Ensure a Well-Defined, Safe Prompt
        const rephrasedResponse = await axios.post(
            `${process.env.OPENAI_ENDPOINT}/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview`,
            {
                messages: [
                    { role: "system", content: rephraseInstruction },
                    { role: "user", content: clarifiedPrompt }
                ],
                max_tokens: 400,
                temperature: 0.7
            },
            { headers: { "api-key": process.env.OPENAI_API_KEY } }
        );

        const suggestions = rephrasedResponse.data.choices[0].message.content.split("\n").filter(Boolean);

        // Step 6: Return Final Processed Prompts
        context.res = {
            status: 200,
            body: {
                originalPrompt: prompt,
                detectedLanguage: detectedLanguage !== "English" ? detectedLanguage : "English",
                moderationFlags: flaggedCategories,
                suggestedPrompts: suggestions
            }
        };
    } catch (error) {
        context.res = { status: 500, body: `Error processing request: ${error.message}` };
    }
};
