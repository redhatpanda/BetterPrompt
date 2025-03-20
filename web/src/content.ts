console.log("✅ Content script loaded!");

// ✅ Inject `inject.js` to load React UI
function injectReactScript() {
  if (document.getElementById("better-prompt-script")) {
    console.warn("⚠️ React script already injected!");
    return;
  }

  console.log("🚀 Injecting React components...");

  const script = document.createElement("script");
  script.id = "better-prompt-script";
  script.src = chrome.runtime.getURL("inject.js"); // ✅ Inject compiled React script
  script.type = "module";
  script.onload = () => console.log("✅ Injected React script!");

  document.body.appendChild(script);
}

// ✅ Run function on page load
injectReactScript();

// ✅ Input detection & message passing (Preserved from original content.ts)
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
    console.log("📝 Detected input:", target.value);

    // Send text to background script
    chrome.runtime.sendMessage({ type: "TEXT_INPUT", text: target.value }, (response) => {
      console.log("📩 Response from background:", response);
    });
  }
}

// ✅ Attach input event listener
document.addEventListener("input", handleInput, true);

// ✅ Observe Shadow DOM for dynamically added elements (Preserved from original content.ts)
function observeShadowDOM(root: Document | ShadowRoot) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.shadowRoot) {
          console.log("👀 Observing new Shadow DOM element...");
          observeShadowDOM(node.shadowRoot);
        }
      });
    }
  });

  observer.observe(root, { childList: true, subtree: true });
}

// ✅ Start observing the document
observeShadowDOM(document);
