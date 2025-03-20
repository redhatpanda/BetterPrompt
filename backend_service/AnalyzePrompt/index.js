const axios = require("axios");

module.exports = async function (context, req) {
    const prompt = req.body.prompt;

    if (!prompt) {
        context.res = { status: 400, body: "Prompt is required" };
        return;
    }

    try {
        // Step 1: Detect Language Using OpenAI
        const languageResponse = await axios.post(
            `${process.env.OPENAI_ENDPOINT}/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview`,
            {
                messages: [
                    { role: "system", content: "Identify the language of the given text. Return only the language name, nothing else." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 10,
                temperature: 0.3
            },
            { headers: { "api-key": process.env.OPENAI_API_KEY } }
        );

        const detectedLanguage = languageResponse.data.choices[0].message.content.trim();

        let translatedPrompt = prompt;

        if (detectedLanguage !== "English") {
            // Step 2: Translate Non-English Text to English
            const translationResponse = await axios.post(
                `${process.env.OPENAI_ENDPOINT}/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview`,
                {
                    messages: [
                        { role: "system", content: `Translate this text into English while preserving its original intent. Only return the translated text, no explanations. Original language detected: ${detectedLanguage}.` },
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 400,
                    temperature: 0.5
                },
                { headers: { "api-key": process.env.OPENAI_API_KEY } }
            );

            translatedPrompt = translationResponse.data.choices[0].message.content.trim();
        }

        // Step 3: Clarify Ambiguous Prompt
        const contextAnalysisResponse = await axios.post(
            `${process.env.OPENAI_ENDPOINT}/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview`,
            {
                messages: [
                    { role: "system", content: "Analyze this prompt and fix any ambiguities. Provide a clear, complete, and well-formed version of the prompt. Return only the improved prompt, no additional text." },
                    { role: "user", content: translatedPrompt }
                ],
                max_tokens: 400,
                temperature: 0.7
            },
            { headers: { "api-key": process.env.OPENAI_API_KEY } }
        );
        const clarifiedPrompt = contextAnalysisResponse.data.choices[0].message.content.trim();

        // Step 4: Run Content Safety Check
        const moderationResponse = await axios.post(
            `${process.env.CONTENT_SAFETY_ENDPOINT}/contentsafety/text:analyze?api-version=2023-10-01`,
            { text: clarifiedPrompt, categories: ["Hate", "Sexual", "Violence", "SelfHarm"] },
            { headers: { "Ocp-Apim-Subscription-Key": process.env.CONTENT_SAFETY_API_KEY } }
        );
        const flaggedCategories = moderationResponse.data.categoriesAnalysis
            .filter((cat) => cat.severity > 1)
            .map((cat) => cat.category);

        // Step 5: Final Rephrasing & Refinement
        let rephraseInstruction = `Ensure this prompt is clear, specific, and well-defined. Remove any NSFW, biased, racist, or inappropriate content while keeping the meaning intact.
        Return the output in this exact JSON format:
        {
            "originalPrompt": "${prompt}",
            "clarifiedPrompt": "${clarifiedPrompt}",
            "detectedLanguage": "${detectedLanguage}",
            "moderationFlags": ${JSON.stringify(flaggedCategories)},
            "rephrasedPrompt1": "First improved version",
            "rephrasedPrompt2": "Second improved version",
            "rephrasedPrompt3": "Third improved version"
        }
        Do not add any extra text or explanations. Only return the JSON object exactly as shown above.`;

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

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(rephrasedResponse.data.choices[0].message.content);
        } catch (error) {
            jsonResponse = {
                originalPrompt: prompt,
                clarifiedPrompt: clarifiedPrompt,
                detectedLanguage: detectedLanguage,
                moderationFlags: flaggedCategories,
                rephrasedPrompt1: "Error parsing JSON output from OpenAI",
                rephrasedPrompt2: "Ensure OpenAI strictly follows the JSON format",
                rephrasedPrompt3: "Check system instructions to prevent explanations"
            };
        }

        // Step 6: Return Final Processed Prompt
        context.res = {
            status: 200,
            body: jsonResponse
        };
    } catch (error) {
        context.res = { status: 500, body: `Error processing request: ${error.message}` };
    }
};
