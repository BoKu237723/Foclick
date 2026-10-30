
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
            result: "Enter a website to search on (e.g. youtube.com)." 
        };
    
    } else {

        let searchUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(searchVal)
        browser.tabs.create({
            url: searchUrl
        });
    
        return{
            success: true,
            result: `Processed: ${url} and ${searchVal}`
        }

    }

}