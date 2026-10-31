const theme_select = document.getElementById("theme");

// Get URL lists from local (get_url, remove_url)
browser.runtime.sendMessage({action : "get_urls"}). then ((available_urls) => {
    let website_list = document.getElementById("website_list");
    website_list.innerHTML = ""; // Clear existing list if any
    
    for (let [website, url] of Object.entries(available_urls)) {
        website_list.innerHTML += `
            <div class="website-item">
                <span>${website}: ${url}</span>
                <button class="remove-btn" data-website="${website}">Remove</button>
            </div>
        `;
    }

    // Remove function
    document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", () => {
            let website = button.dataset.website;
            browser.runtime.sendMessage({
                action: "remove_url",
                url: website
            }).then(() => {
                button.parentElement.remove();
            });
        });
    });
});

// Load saved theme
browser.storage.local.get("theme").then((data) => {
    const theme = data.theme || "light";
    theme_select.value = theme;
    document.body.classList.toggle("dark-mode", theme === "dark")
});

// Save and apply new theme
theme_select.addEventListener("change", () => {
    const theme = theme_select.value;
    document.body.classList.toggle("dark-mode", theme === "dark")

    browser.storage.local.set({ theme });
});