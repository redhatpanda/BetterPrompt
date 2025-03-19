function injectUI() {
    if (document.getElementById("mui-floating-button")) {
      console.log("⚠️ UI already injected!");
      return;
    }
  
    console.log("🚀 Injecting Floating Button and Sidebar...");
  
    // ✅ Floating Button
    const button = document.createElement("button");
    button.id = "mui-floating-button";
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
  
    // ✅ Sidebar
    const sidebar = document.createElement("div");
    sidebar.id = "mui-sidebar-container";
    sidebar.innerHTML = `
      <div id="mui-sidebar">
        <button id="close-sidebar">❌</button>
        <h2>Sidebar Content</h2>
        <p>This is a sidebar injected into the page.</p>
      </div>
    `;
    document.body.appendChild(sidebar);
  
    // ✅ Button click opens sidebar
    button.addEventListener("click", () => {
      sidebar.style.right = "0";
    });
  
    // ✅ Close button hides sidebar
    document.getElementById("close-sidebar")?.addEventListener("click", () => {
      sidebar.style.right = "-300px";
    });
  
    console.log("🚀 Injected Floating Button and Sidebar...");
  }
  
  // ✅ Inject UI when page loads
  injectUI();
  