const theme_select = document.getElementById("theme");

// Send website link dictionary --> background.js
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
    document.body.classList.toggle("dark-mode", theme === "dark");
});

// Save and apply theme
theme_select.addEventListener("change", async () => {
    const theme = theme_select.value;

    document.body.classList.toggle("dark-mode", theme === "dark");

    await browser.storage.local.set({ theme });
});

document.getElementById("theme").addEventListener("change", async (event) => {
    let theme = event.target.value;

    await browser.storage.local.set({ theme });

    updateIcon(theme);
});

loadData();