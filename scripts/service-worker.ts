/// <reference path="../node_modules/chrome-types/index.d.ts"/>

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