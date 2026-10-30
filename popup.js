const target_website = document.getElementById("target_website")
const target_search = document.getElementById("target_search")
const result = document.getElementById("process_output")

document.getElementById('search_btn').addEventListener('click', async () => {
    const url = target_website.value.trim();
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