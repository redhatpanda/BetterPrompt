console.log("Content script loaded!");

function injectReactScript() {
  if (document.getElementById("better-prompt-script")) {
    console.warn("React script already injected!");
    return;
  }


  const script = document.createElement("script");
  script.id = "better-prompt-script";
  script.src = chrome.runtime.getURL("inject.js");
  script.type = "module";
  script.onload = () => console.log("Injected React script!");

  document.body.appendChild(script);
}

injectReactScript();

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {

    chrome.runtime.sendMessage({ type: "TEXT_INPUT", text: target.value }, (response) => {
      console.log("📩 Response from background:", response);
    });
  }
}

document.addEventListener("input", handleInput, true);

function observeShadowDOM(root: Document | ShadowRoot) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.shadowRoot) {
          console.log("Observing new Shadow DOM element...");
          observeShadowDOM(node.shadowRoot);
        }
      });
    }
  });

  observer.observe(root, { childList: true, subtree: true });
}

observeShadowDOM(document);
window.addEventListener("message", (event) => {
  if (event.source !== window || event.data.type !== "FETCH_PROMPTS") {
    return;
  }

  console.log("Content script received prompt:", event.data.prompt);

  
  chrome.runtime.sendMessage(
    { action: "fetchRephrasedPrompts", prompt: event.data.prompt },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error:", chrome.runtime.lastError);
      } else {
        console.log("Content script received response:", response);

        
        window.postMessage({ type: "PROMPT_RESPONSE", data: response }, "*");
      }
    }
  );
});