console.log("✅ Content script loaded!");
const button = document.createElement("button");
button.innerText = "📜 Open Sidebar";
button.style.position = "fixed";
button.style.bottom = "20px";
button.style.right = "20px";
button.style.zIndex = "100000";
button.style.padding = "10px 20px";
button.style.background = "#1976D2";
button.style.color = "#fff";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.cursor = "pointer";
button.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
document.body.appendChild(button);
const sidebar = document.createElement("div");
sidebar.id = "custom-sidebar";
sidebar.style.position = "fixed";
sidebar.style.top = "0";
sidebar.style.right = "-300px"; // Initially hidden
sidebar.style.width = "300px";
sidebar.style.height = "100vh";
sidebar.style.background = "#f9f9f9";
sidebar.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
sidebar.style.transition = "right 0.3s ease-in-out";
sidebar.style.padding = "15px";
sidebar.style.overflowY = "auto";
sidebar.style.zIndex = "1000000";

// ✅ Sidebar Header with Close Button
const header = document.createElement("div");
header.style.display = "flex";
header.style.justifyContent = "space-between";
header.style.alignItems = "center";
header.style.paddingBottom = "10px";
header.innerHTML = `
  <h3 style="margin: 0; color: #333;">Captured Text</h3>
  <button id="close-sidebar" style="background: none; border: none; font-size: 18px; cursor: pointer;">❌</button>
`;
sidebar.appendChild(header);

// ✅ Text Area for Backend Response
const textArea = document.createElement("textarea");
textArea.id = "captured-text";
textArea.style.width = "100%";
textArea.style.height = "calc(100% - 40px)";
textArea.style.padding = "10px";
textArea.style.border = "1px solid #ccc";
textArea.style.borderRadius = "5px";
textArea.style.resize = "none";
sidebar.appendChild(textArea);

// ✅ Append Sidebar to Body
document.body.appendChild(sidebar);

// ✅ Open Sidebar on Button Click
button.addEventListener("click", () => {
  sidebar.style.right = "0";
});

// ✅ Close Sidebar on Click
document.getElementById("close-sidebar")?.addEventListener("click", () => {
  sidebar.style.right = "-300px";
});
// ✅ Input detection & message passing
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
    console.log("📝 Detected input:", target.value);

    // Send text to background script
    chrome.runtime.sendMessage({ type: "TEXT_INPUT", text: target.value }, (response) => {
      console.log("📩 Response from background:", response);
      if (response && response.text) {
        textArea.value = response.text;
      } else {
        textArea.value = "⚠️ No response received.";
      }
 
    });
    
  }
}

// ✅ Attach input event listener
document.addEventListener("input", handleInput, true);

// ✅ Observe Shadow DOM for dynamically added elements
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
