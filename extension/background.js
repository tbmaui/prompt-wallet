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

        // Target URL for the local instance (WITHOUT the text payload to avoid HTTP 431 errors)
        const targetUrl = 'http://localhost:3000/?capture=true';

        // Open a new tab with the target URL
        chrome.tabs.create({ url: targetUrl }, (newTab) => {
            // Wait for the new tab to finish loading
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === newTab.id && changeInfo.status === 'complete') {
                    // Remove the listener so it only fires once
                    chrome.tabs.onUpdated.removeListener(listener);

                    // Inject a script to pass the large text payload securely to the React app
                    chrome.scripting.executeScript({
                        target: { tabId: newTab.id },
                        func: (textPayload) => {
                            window.postMessage({ type: 'EXTENSION_CAPTURE', text: textPayload }, '*');
                        },
                        args: [capturedText]
                    });
                }
            });
        });
    }
});
