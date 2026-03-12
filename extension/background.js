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
    if (info.menuItemId === "add-to-promptwallet") {
        // Execute script in the active tab to extract formatted text
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) return "";

                const container = document.createElement("div");
                for (let i = 0; i < selection.rangeCount; i++) {
                    container.appendChild(selection.getRangeAt(i).cloneContents());
                }

                // Very basic HTML to Markdown conversion for common elements
                function convertToMarkdown(node) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        return node.textContent;
                    }
                    if (node.nodeType !== Node.ELEMENT_NODE) return "";

                    let md = "";
                    for (const child of node.childNodes) {
                        md += convertToMarkdown(child);
                    }

                    switch (node.tagName.toLowerCase()) {
                        case 'p':
                        case 'div':
                        case 'section':
                        case 'article':
                            return md + "\n\n";
                        case 'br':
                            return "\n";
                        case 'li':
                            return "- " + md.trim() + "\n";
                        case 'ul':
                        case 'ol':
                            return "\n" + md + "\n";
                        case 'h1': return "# " + md + "\n\n";
                        case 'h2': return "## " + md + "\n\n";
                        case 'h3': return "### " + md + "\n\n";
                        case 'h4': return "#### " + md + "\n\n";
                        case 'strong':
                        case 'b':
                            return "**" + md + "**";
                        case 'em':
                        case 'i':
                            return "*" + md + "*";
                        case 'blockquote':
                            return md.trim().split('\n').map(l => '> ' + l).join('\n') + "\n\n";
                        case 'pre':
                            return "```\n" + md + "\n```\n\n";
                        case 'code':
                            return "`" + md + "`";
                        default:
                            return md;
                    }
                }

                let markdown = convertToMarkdown(container);

                // Clean up excessive newlines
                markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();
                return markdown;
            }
        }).then((injectionResults) => {
            // Fallback to the plain text selection if extraction failed or returned nothing
            const capturedText = injectionResults[0]?.result || info.selectionText;

            if (!capturedText) return;

            // Target URL for the local instance
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
                                sessionStorage.setItem('promptWalletExtCapture', textPayload);
                                window.postMessage({ type: 'EXTENSION_CAPTURE', text: textPayload }, '*');
                            },
                            args: [capturedText]
                        });
                    }
                });
            });
        }).catch((err) => {
            console.error("Failed to extract formatted text: ", err);

            // Fallback if we cannot inject a script (e.g. chrome:// URIs)
            if (info.selectionText) {
                const targetUrl = 'http://localhost:3000/?capture=true';
                chrome.tabs.create({ url: targetUrl }, (newTab) => {
                    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                        if (tabId === newTab.id && changeInfo.status === 'complete') {
                            chrome.tabs.onUpdated.removeListener(listener);
                            chrome.scripting.executeScript({
                                target: { tabId: newTab.id },
                                func: (textPayload) => {
                                    sessionStorage.setItem('promptWalletExtCapture', textPayload);
                                    window.postMessage({ type: 'EXTENSION_CAPTURE', text: textPayload }, '*');
                                },
                                args: [info.selectionText]
                            });
                        }
                    });
                });
            }
        });
    }
});
