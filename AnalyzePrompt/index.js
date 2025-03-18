const axios = require('axios');
// Remove Racism, Remove Bias, Analyze Text to get the context.
module.exports = async function (context, req) {
    const prompt = req.body.prompt;

    if (!prompt) {
        context.res = { status: 400, body: "Prompt is required" };
        return;
    }

    const moderationResponse = await axios.post(
        `${process.env.CONTENT_SAFETY_ENDPOINT}/contentsafety/text:analyze?api-version=2023-10-01`,
        {
            text: prompt,
            categories: ["Hate", "Sexual", "Violence", "SelfHarm"] 
        },
        {
            headers: { 'Ocp-Apim-Subscription-Key': process.env.CONTENT_SAFETY_API_KEY }
        }
    );

    const flaggedCategories = moderationResponse.data.categoriesAnalysis
        .filter(cat => cat.severity > 1)
        .map(cat => cat.category);

    let systemPrompt = "Correct grammatical errors, clarify ambiguities, enhance precision, and generate 3 improved prompt variations. Make sure you get the context of the prompt right. The output should not change the original intent of the prompt.";

    if (flaggedCategories.length > 0) {
        systemPrompt += " Additionally, rephrase to remove or neutralize sensitive, NSFW, or harmful content, ensuring the prompt is safe and ethical.";
    }

    const openAiResponse = await axios.post(
        `${process.env.OPENAI_ENDPOINT}`,
        {
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 400,
            temperature: 0.7
        },
        {
            headers: { 'api-key': process.env.OPENAI_API_KEY }
        }
    );

    const suggestions = openAiResponse.data.choices[0].message.content.split('\n').filter(Boolean);

    context.res = {
        status: 200,
        body: {
            originalPrompt: prompt,
            moderationFlags: flaggedCategories,
            suggestedPrompts: suggestions
        }
    };
};
