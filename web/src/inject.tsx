import { createRoot } from "react-dom/client";
import FloatingButton from "./FloatingButton";

console.log("✅ Inject script running...");

const getContentEditableText = (el: HTMLElement) => {
  return el.innerText || "";
};

function injectUI() {
  const textAreas = document.querySelectorAll("textarea, [contenteditable='true']");

  if (textAreas.length === 0) {
    console.warn("⚠️ No text areas found.");
    return;
  }

  textAreas.forEach((textArea) => {
    if (!textArea.parentElement) return;

    if (document.querySelector("#mui-floating-button-container")) return;

    console.log("✅ Injecting floating button...");

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "mui-floating-button-container";
    buttonContainer.style.position = "fixed";
    buttonContainer.style.bottom = "20px";
    buttonContainer.style.right = "20px";
    buttonContainer.style.zIndex = "9999";

    document.body.appendChild(buttonContainer);

    const root = createRoot(buttonContainer);
    root.render(
      <FloatingButton
        textArea={textArea as HTMLTextAreaElement}
        getContentEditableText={textArea.hasAttribute("contenteditable") ? getContentEditableText : undefined}
      />
    );
  });
}

injectUI();


const observer = new MutationObserver(() => injectUI());
observer.observe(document.body, { childList: true, subtree: true });
