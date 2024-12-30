"use strict";
/// <reference path="../node_modules/chrome-types/index.d.ts"/>
chrome.runtime.onInstalled.addListener(() => {
    console.log("TabToFrontCustom installed");
});
chrome.tabs.onCreated.addListener(function (tab) {
    if (tab.status === 'unloaded')
        return;
    if (!tab.id)
        return;
    if (lastClickTabId) {
        if (openNextTabInForeground) {
            chrome.tabs.update(tab.id, { active: true });
        }
        else {
            // open in background (automatically)
        }
        lastClickTabId = null;
        openNextTabInForeground = true;
        return;
    }
    // no link clicked or clicked with middle mouse button -> open in foreground
    chrome.tabs.update(tab.id, { active: true });
});
let lastClickTabId = null;
let openNextTabInForeground = true;
// Add this listener
chrome.runtime.onMessage.addListener((message, sender) => {
    var _a;
    if (message.type === 'LINK_CLICK' && ((_a = sender.tab) === null || _a === void 0 ? void 0 : _a.id)) {
        lastClickTabId = sender.tab.id;
        const modifiers = message.modifiers;
        if (modifiers.meta) {
            //let the tab open in background
            openNextTabInForeground = false;
        }
        else {
            openNextTabInForeground = true;
        }
    }
    return true;
});
