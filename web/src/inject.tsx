import { createRoot } from "react-dom/client";
import FloatingButton from "./FloatingButton";

console.log("✅ Inject script running...");

// ✅ Inject Floating Button inside all text areas
function injectUI() {
  const textAreas = document.querySelectorAll("textarea, [contenteditable='true']");

  if (textAreas.length === 0) {
    console.warn("⚠️ No text areas found.");
    return;
  }

  textAreas.forEach((textArea) => {
    if (!textArea.parentElement) return;

    // ✅ Prevent duplicate injection
    if (textArea.parentElement.querySelector("#mui-floating-button-container")) return;

    console.log("✅ Injecting floating button near text area...");

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "mui-floating-button-container";
    buttonContainer.style.position = "absolute";
    buttonContainer.style.right = "5px";
    buttonContainer.style.bottom = "5px";
    buttonContainer.style.zIndex = "9999";

    // ✅ Attach inside the text area container
    textArea.parentElement.appendChild(buttonContainer);

    // ✅ Inject React Floating Button
    const root = createRoot(buttonContainer);
    root.render(<FloatingButton textArea={textArea as HTMLTextAreaElement} />);
  });
}

// ✅ Run injection when script loads
injectUI();

// ✅ Observe dynamically loaded text areas
const observer = new MutationObserver(() => injectUI());
observer.observe(document.body, { childList: true, subtree: true });
