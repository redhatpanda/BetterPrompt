import { createRoot } from "react-dom/client";
import FloatingButton from "./FloatingButton";

console.log("Inject script running...");

function injectUI() {
  const textAreas = document.querySelectorAll("textarea, [contenteditable='true']");

  if (textAreas.length === 0) {
    console.warn("No text areas found.");
    return;
  }

  textAreas.forEach((textArea) => {
    if (!textArea.parentElement) return;

    if (document.getElementById("mui-floating-button-container")) return;

    console.log("Injecting floating button...");

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "mui-floating-button-container";
    document.body.appendChild(buttonContainer);
    const root = createRoot(buttonContainer);
    root.render(<FloatingButton textArea={textArea as HTMLTextAreaElement} />);
  });
}

injectUI();

const observer = new MutationObserver(() => injectUI());
observer.observe(document.body, { childList: true, subtree: true });
