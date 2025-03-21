import { createRoot } from "react-dom/client";
import FloatingButton from "./FloatingButton";

console.log("✅ Inject script running...");

function injectUI() {
  let textAreas: Element[] = Array.from(document.querySelectorAll("textarea, [contenteditable='true']"));

  if (textAreas.length === 0) {
    console.warn("⚠️ No text areas found.");
    return;
  }


  if (textAreas.length > 1) {
    const hasTextarea = textAreas.some((el) => el.tagName.toLowerCase() === "textarea");
    const hasContentEditable = textAreas.some(
      (el) => el.getAttribute("contenteditable") === "true"
    );

    if (hasTextarea && hasContentEditable) {
      textAreas = textAreas.filter((el) => el.tagName.toLowerCase() !== "textarea");
    }
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
        textArea={textArea as HTMLElement}
        getContentEditableText={textArea.hasAttribute("contenteditable") ? true : false}
      />
    );
  });
}

injectUI();

const observer = new MutationObserver(() => injectUI());
observer.observe(document.body, { childList: true, subtree: true });