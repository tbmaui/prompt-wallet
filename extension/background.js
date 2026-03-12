// Wait for the extension to be installed or updated
chrome.runtime.onInstalled.addListener(() => {
    // Create the context menu
    chrome.contextMenus.create({
        id: "add-to-promptwallet",
        title: "Add to Prompt Wallet",
        contexts: ["selection"]
    });
});

// Listen for clicks on the context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "add-to-promptwallet" && info.selectionText) {
        const capturedText = info.selectionText;

        // Target URL for the local instance
        // Need to URL encode the captured text so it safely travels in the query parameter
        const targetUrl = `http://localhost:3000/?capture=true&text=${encodeURIComponent(capturedText)}`;

        // Open a new tab with the target URL
        chrome.tabs.create({ url: targetUrl });
    }
});
