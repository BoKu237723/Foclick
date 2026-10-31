
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

browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.get("available_urls").then((data) => {
        if (!data.available_urls) {
            browser.storage.local.set({ available_urls: available_urls });
        }
    });
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // 1. Return website list
    if (message.action === "get_urls") {
        return browser.storage.local.get("available_urls").then((data) => {
            return data.available_urls || available_urls;
        });
    }

    // 2. Remove a website url
    if (message.action === "remove_url") {
        return browser.storage.local.get("available_urls").then((data) => {
            let urls = data.available_urls || available_urls;
            delete urls[message.url];
            return browser.storage.local.set({ available_urls: urls });
        });
    }

    // 3. Process search URL
    if (message.action === "PROCESS_URL") {
        return processURL(message.url, message.searchVal);
    }
});

async function processURL(url, searchVal) {
    // Load current URLs from storage
    let data = await browser.storage.local.get("available_urls");
    let current_urls = data.available_urls || available_urls;

    if (!searchVal?.trim()) {
        return {
            success: false,
            result: `Enter something to search! searchVal is ${searchVal}.`
        };
    } else if (!url?.trim()) {
        return { 
            success: false, 
            result: `Enter a website to search on (e.g. youtube.com). Your url is ${url}.`
        };
    } else if (!(url in current_urls)) {
        return {
            success: false,
            result: `Unsupported URL.`
        };
    } else {
        let target = current_urls[url];
        let searchUrl = target + encodeURIComponent(searchVal);
        browser.tabs.create({
            url: searchUrl
        });
    
        return {
            success: true,
            result: `Processed: ${url} and ${searchVal}`
        };
    }
}