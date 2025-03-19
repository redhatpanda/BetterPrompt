console.log("✅ Background script loaded!");

// Keep service worker active by listening for events
chrome.runtime.onInstalled.addListener(() => {
  console.log("🔄 Extension Installed or Updated");
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "TEXT_INPUT") {
    console.log("📩 Received text input:", message.text);

    // Store input (optional)
    chrome.storage.local.set({ lastInput: message.text });

    // Send response
    sendResponse({ status: "Received", text: message.text });
  }

  return true; // Keep service worker alive
});

// Prevent background script from getting unloaded quickly
setInterval(() => {
  chrome.runtime.getPlatformInfo(() => {}); // Dummy call to keep service worker alive
}, 25 * 1000); // Refresh every 25 seconds
