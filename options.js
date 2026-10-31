const theme_select = document.getElementById("theme");

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