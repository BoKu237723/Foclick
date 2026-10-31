let available_urls = {
    youtube: "https://www.youtube.com/results?search_query=",
    facebook: "https://www.facebook.com/search/top?q=",
    linkedin: "https://www.linkedin.com/search/results/all/?keywords=",
    instagram: "https://www.instagram.com/explore/search/keyword/?q=",
    x: "https://x.com/search?q=",
    twitter: "https://x.com/search?q=",
    threads: "https://www.threads.net/search?q=",
    reddit: "https://www.reddit.com/search/?q=",
    pinterest: "https://www.pinterest.com/search/pins/?q=",
    snapchat: "https://www.snapchat.com/spotlight/search?q=",
    twitch: "https://www.twitch.tv/search?term=",
    quora: "https://www.quora.com/search?q=",
    medium: "https://medium.com/search?q="
};

// Put the default links to local on install
browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.get("available_urls").then((data) => {
        if(!data.available_urls) {
            browser.storage.local.set({ available_urls : available_urls});
        }
    });
});

// CRUD Functionalities
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // 1. Return website list from local
    if (message.action === "get_urls") {
        return browser.storage.local.get("available_urls").then((data) => {
            return data.available_urls || available_urls
        });
    }

    // 2. Remove a website url from local
    if (message.action === "remove_url") {
        return browser.storage.local.get("available_urls").then((data) => {
            let urls = data.available_urls || available_urls;
            delete urls[message.url];
            return browser.storage.local.set({ available_urls : urls})
        });
    }

    // 3. Add new url to local (key / value)
    if (message.action === "add_url"){
        return browser.storage.local.get("available_urls").then((data) => {
            let urls = data.available_urls || available_urls;
            urls[message.key] = message.value;
            alert(0);
            return browser.storage.local.set({ available_urls: urls })
        });
    }

    // 4. Process searched URL
    if (message.action === "process_url") {
        return processURL(message.typedWeb, message.typedVal)
    }
})

// Processing the URL (Main Objective)
async function processURL(typedWeb, typedVal) {
    // Load current URLs from storage
    let data = await browser.storage.local.get("available_urls");
    let current_urls = data.available_urls || available_urls;

    if (!typedVal?.trim()) {
        return {
            success: false,
            result: "Enter something to search!"
        };
    }

    if (!typedWeb?.trim()) {
        return {
            success: false,
            result: "Enter a website to search!"
        };
    }

    if (!Object.hasOwn(data.available_urls, typedWeb)){
        return { 
            success: false,
            result: "Unsupported URL!"
        };
    }

    let target = current_urls[typedWeb];
    let searchURL = target + encodeURIComponent(typedVal);
    browser.tabs.create({
        url: searchURL
    });

    return {
        success: true,
        result: `Processed: ${typedWeb} and ${typedVal}`
    };
}