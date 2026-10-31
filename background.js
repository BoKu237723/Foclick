
let available_urls = {
    youtube: "https://www.youtube.com/results?search_query=",
    facebook: "https://www.facebook.com/search/top?q=",
    linkedin: "https://www.linkedin.com/search/results/all/?keywords=",
    instagram: "https://www.instagram.com/explore/search/keyword/?q=",
    x: "https://x.com/search?q=",
    threads: "https://www.threads.net/search?q=",
    reddit: "https://www.reddit.com/search/?q=",
    pinterest: "https://www.pinterest.com/search/pins/?q=",
    snapchat: "https://www.snapchat.com/spotlight/search?q=",
    twitch: "https://www.twitch.tv/search?term=",
    quora: "https://www.quora.com/search?q=",
    medium: "https://medium.com/search?q="
};

browser.runtime.onMessage.addListener(async (message) => {
    if (message.action !== "PROCESS_URL"){
        return;
    }
    return processURL(message.url, message.searchVal)
});

async function processURL(url, searchVal) {

    if (!searchVal?.trim()) {
        return{
            success: false,
            result: `Enter something to search! searchVal is ${searchVal}.`
        };
    
    } else if (!url?.trim()){
        return { 
            success: false, 
            result: `Enter a website to search on (e.g. youtube.com). Your url is ${url}.`
        };

    } else if (!url in available_urls) {
        return {
            success: false,
            result: `Unsupported URL.`
        };

    } else {

        target = available_urls[url]

        let searchUrl = target + encodeURIComponent(searchVal)
        browser.tabs.create({
            url: searchUrl
        });
    
        return{
            success: true,
            result: `Processed: ${url} and ${searchVal}`
        }

    }

}