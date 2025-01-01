"use strict";
/// <reference path="../node_modules/chrome-types/index.d.ts"/>
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//my arc seems buggy (alway opens windows at full screen size), set the new window size here
const config = {
    initialSize: {
        width: 1280,
        height: 800
    }
};
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
// Add startup listener for initial window
chrome.runtime.onStartup.addListener(() => __awaiter(void 0, void 0, void 0, function* () {
    const windows = yield chrome.windows.getAll();
    for (const window of windows) {
        if (window.id) {
            chrome.windows.update(window.id, {
                width: config.initialSize.width,
                height: config.initialSize.height
            });
        }
    }
}));
// Add window creation listener
chrome.windows.onCreated.addListener((window) => {
    console.log("window created", window);
    chrome.windows.update(window.id, {
        width: config.initialSize.width,
        height: config.initialSize.height
    });
    setTimeout(() => {
        chrome.windows.update(window.id, {
            width: config.initialSize.width,
            height: config.initialSize.height
        });
    }, 100);
});
