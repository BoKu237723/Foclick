
const target_website = document.getElementById("target_website")
const target_search = document.getElementById("target_search")
const search_btn = document.getElementById("search_btn")
const result = document.getElementById("process_output")

// Focus functionality
target_website.focus();

target_website.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        target_search.focus();
    }
});

target_search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        search_btn.focus();
    }
});

// Setting button
document.getElementById('settings_btn').addEventListener('click', () => {
    browser.runtime.openOptionsPage();
    window.close();
})

// Process the request --> background.js
document.getElementById('search_btn').addEventListener('click', async () => {
    const typedWeb = target_website.value.trim().toLowerCase();
    const typedVal = target_search.value.trim();
    try {
        const response = await browser.runtime.sendMessage({
            action: "process_url",
            typedWeb,
            typedVal
        })
        if (response?.success) {
            result.textContent = response.result;
            window.close()
        } else {
            result.textContent = "Error: " + (response?.result ?? "Unknown error")
        }
    } catch (error) {
        result.textContent = "Error here: " + error.message;
    }
});

// Load saved theme
browser.storage.local.get("theme").then((data) => {
    const theme = data.theme || "light";
    document.body.classList.toggle("dark-mode", theme === "dark")
    updateIcon(theme)
});

// Setting Icon based on theme
function updateIcon(theme) {
    const icon = document.getElementById("setting_icon");
    if (theme === "dark") {
        icon.src = "icons/settings_bbg.svg";
    } else {
        icon.src = "icons/settings.svg";
    }
}

