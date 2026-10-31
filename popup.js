const target_website = document.getElementById("target_website")
const target_search = document.getElementById("target_search")
const search_btn = document.getElementById("search_btn");
const result = document.getElementById("process_output")

target_website.focus();

// Enter moves focus to the next element
target_website.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        target_search.focus();
    }
});

target_search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        search_btn.focus();
    }
});

// Processes to background.js
document.getElementById('search_btn').addEventListener('click', async () => {
    const url = target_website.value.trim().toLowerCase();
    const searchVal = target_search.value.trim();
    try {
        const response = await browser.runtime.sendMessage({
            action: "PROCESS_URL",
            url,
            searchVal
        })
        if (response?.success) {
            result.textContent = response.result;
            window.close()
        } else {
            result.textContent = "Error: " + (response?.result ?? "Unknown error")
        }
    } catch (error) {
        result.textContent = "Error: " + error.message;
    }
});