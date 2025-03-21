chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "fetchRephrasedPrompts") {
    fetchRephrasedPrompts(message.prompt)
      .then((suggestions) => sendResponse({ success: true, suggestions }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keeps the message channel open for async response
  }
});

const fetchRephrasedPrompts = async (prompt: string) => {
  try {
    const response = await fetch(
      "https://cl-func-ai-app.azurewebsites.net/api/AnalyzePrompt?code=m1O0Wffba6Ga_FufbEzGl8xppUHflNClvx2uFoEdn9N1AzFu_NFfvw==",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      }
    );

    const data = await response.json();
    return [
      data.rephrasedPrompt1,
      data.rephrasedPrompt2,
      data.rephrasedPrompt3,
    ];
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
