const taget_website = document.getElementById("taget_website")
const taget_search = document.getElementById("taget_search")
const result = document.getElementById("process_output")

document.getElementById('search_btn').addEventListener('click', async () => {
    const url = taget_website.value.trim();
    const searchVal = taget_search.value.trim();
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