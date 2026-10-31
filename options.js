const theme_select = document.getElementById("theme");
const new_url = document.getElementById("new_website")
const add_url_btn = document.getElementById("add_website")
const new_website = document.getElementById("new_website")

new_website.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        add_url_btn.focus();
    }
});

// Get URL lists from local (get_url, remove_url)
browser.runtime.sendMessage({action : "get_urls"}). then ((available_urls) => {
    let website_list = document.getElementById("website_list");
    website_list.innerHTML = ""; // Clear existing list if any

    // Display available urls function
    for (let [website, url] of Object.entries(available_urls)) {
        website_list.innerHTML += `
            <div class="website-item">
                <span>${website}: ${url}</span>
                <button class="remove-btn" data-website="${website}">Remove</button>
            </div>
        `;
    }

    browser.storage.local.get("history").then((data) => {
        const history_list = document.getElementById("history_list");
        const history = data.history || [];

        history_list.innerHTML = "";

        // Latest first
        history.reverse().forEach((item) => {
            const history_item = document.createElement("div");
            history_item.className = "history-item";
    
            const details = document.createElement("div");
    
            const website = document.createElement("strong");
            website.textContent = item.website;
    
            const query = document.createElement("p");
            query.textContent = item.query;
    
            const datetime = document.createElement("small");
            datetime.textContent = new Date(item.datetime).toLocaleString();
    
            details.append(website, query, datetime);
            history_item.appendChild(details);
    
            history_list.appendChild(history_item);
        });
    });

    // Clear history function (cuz I know u need ts)
    document.getElementById("clear_history").addEventListener("click", () => {
        browser.storage.local.set({ history: [] }).then(() => {
            window.location.reload();
        })
    })

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

    // Add url function
    add_url_btn.addEventListener("click", () => {
        let input = new_url.value
        let [key, value] = input.split("|");
        key = key.toLowerCase();
        browser.runtime.sendMessage({
            action: "add_url",
            key,
            value
        }).then(()=> {
            new_url.value = "";
            window.location.reload();
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