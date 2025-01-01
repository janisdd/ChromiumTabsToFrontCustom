/// <reference path="../node_modules/chrome-types/index.d.ts"/>

//my arc seems buggy (alway opens windows at full screen size), set the new window size here
const config = {
	initialSize: {
		width: 1280,
		height: 800
	}
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("TabToFrontCustom installed")
})

chrome.tabs.onCreated.addListener(function(tab) {
	if (tab.status === 'unloaded') return;
	if (!tab.id) return;


	if (lastClickTabId) {

		if (openNextTabInForeground) {
			chrome.tabs.update(tab.id, {active: true})
		} else {
			// open in background (automatically)
		}

		lastClickTabId = null
		openNextTabInForeground = true
		return
	} 

	// no link clicked or clicked with middle mouse button -> open in foreground
	chrome.tabs.update(tab.id, {active: true})
})

let lastClickTabId: number | null = null
let openNextTabInForeground = true

// Add this listener
chrome.runtime.onMessage.addListener((message: any, sender) => {

	if (message.type === 'LINK_CLICK' && sender.tab?.id) {
		lastClickTabId = sender.tab.id
		const modifiers: ClickModifiers = message.modifiers
		if (modifiers.meta) {
			//let the tab open in background
			openNextTabInForeground = false
		} else {
			openNextTabInForeground = true
		}
	}
	return true
})

// Add startup listener for initial window
chrome.runtime.onStartup.addListener(async () => {
  const windows = await chrome.windows.getAll();
  for (const window of windows) {
    if (window.id) {
      chrome.windows.update(window.id, {
        width: config.initialSize.width,
        height: config.initialSize.height
      });
    }
  }
});

// Add window creation listener
chrome.windows.onCreated.addListener((window) => {
	console.log("window created", window);
	
  chrome.windows.update(window.id!, {
    width: config.initialSize.width,
    height: config.initialSize.height
  })
	setTimeout(() => {
		chrome.windows.update(window.id!, {
			width: config.initialSize.width,
			height: config.initialSize.height
		})
	}, 100)
})
