"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const darkIcons = {
    16: "src/images/moon-16.png",
    32: "src/images/moon-32.png",
    48: "src/images/moon-48.png",
    128: "src/images/moon-128.png"
};
const darkMode = {
    mode: "dark",
    title: "Switch to light mode",
    icons: darkIcons
};
const lightIcons = {
    16: "src/images/sun-16.png",
    32: "src/images/sun-32.png",
    48: "src/images/sun-48.png",
    128: "src/images/sun-128.png"
};
const lightMode = {
    mode: "light",
    title: "Switch to dark mode",
    icons: lightIcons
};
chrome.action.onClicked.addListener((tab) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTabId = tab.id;
    if (currentTabId) {
        const currentTitle = yield chrome.action.getTitle({ tabId: currentTabId });
        const nextMode = currentTitle === lightMode.title ? darkMode : lightMode;
        yield setTitle(currentTabId, nextMode.title);
        yield setIcon(currentTabId, nextMode.icons);
        yield toggleCSS(currentTabId, nextMode.mode);
        if (tab.url) {
            yield setPreference(tab.url, nextMode.mode);
        }
    }
}));
chrome.tabs.onCreated.addListener((tab) => {
    if (tab.id && tab.url) {
        getPreference(tab.id, tab.url);
    }
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.url) {
        getPreference(tabId, tab.url);
    }
});
const setTitle = (tabId, nextTitle) => {
    return chrome.action.setTitle({
        tabId: tabId,
        title: nextTitle,
    });
};
const setIcon = (tabId, nextIcon) => {
    return chrome.action.setIcon({
        tabId: tabId,
        path: nextIcon
    });
};
const toggleCSS = (tabId, mode) => {
    if (mode === 'dark') {
        return chrome.scripting.insertCSS({
            files: ["src/styles/dark-mode.css"],
            target: { tabId: tabId },
        });
    }
    else {
        return chrome.scripting.removeCSS({
            files: ["src/styles/dark-mode.css"],
            target: { tabId: tabId },
        });
    }
};
const setPreference = (url, preference) => {
    const origin = getOrigin(url);
    const newPreference = {
        [origin]: preference
    };
    return chrome.storage.local.set(newPreference);
};
const getPreference = (tabId, url) => {
    const origin = getOrigin(url);
    chrome.storage.local.get(origin, (storedPreferences) => __awaiter(void 0, void 0, void 0, function* () {
        const preference = storedPreferences[origin];
        if (preference) {
            const preferredMode = preference === 'dark' ? darkMode : lightMode;
            yield setTitle(tabId, preferredMode.title);
            yield setIcon(tabId, preferredMode.icons);
            yield toggleCSS(tabId, preferredMode.mode);
        }
    }));
};
const getOrigin = (url) => {
    const urlObject = new URL(url);
    return urlObject.origin;
};
