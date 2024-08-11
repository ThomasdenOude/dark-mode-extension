"use strict";
const darkIcons = {
    16: "src/images/moon-16.png",
    32: "src/images/moon-32.png",
    48: "src/images/moon-48.png",
    128: "src/images/moon-128.png"
};
const lightIcons = {
    16: "src/images/sun-16.png",
    32: "src/images/sun-32.png",
    48: "src/images/sun-48.png",
    128: "src/images/sun-128.png"
};
const darkMode = {
    mode: "dark",
    title: "Switch to light mode",
    icons: darkIcons
};
const lightMode = {
    mode: "light",
    title: "Switch to dark mode",
    icons: lightIcons
};
chrome.action.onClicked.addListener((tab) => {
    const { id, url } = tab;
    if (id) {
        chrome.action.getTitle({ tabId: id }).then(title => {
            const nextMode = title === lightMode.title ? 'dark' : 'light';
            void setMode(id, nextMode);
            if (url) {
                void savePreference(url, nextMode);
            }
        });
    }
});
chrome.tabs.onCreated.addListener(async (tab) => {
    const { id, url } = tab;
    if (id && url) {
        getPreference(id, url);
    }
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    var _a;
    const url = (_a = tab.url) !== null && _a !== void 0 ? _a : changeInfo.url;
    if (tabId && url) {
        getPreference(tabId, url);
    }
});
chrome.tabs.onActivated.addListener((activeInfo) => {
    const { tabId } = activeInfo;
    chrome.tabs.get(tabId, function (tab) {
        if (tabId && tab.url) {
            getPreference(tabId, tab.url);
        }
    });
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
    return chrome.tabs.sendMessage(tabId, { mode: mode });
};
const setMode = (tabId, mode) => {
    const modeInfo = mode === 'dark' ? darkMode : lightMode;
    void setTitle(tabId, modeInfo.title);
    void setIcon(tabId, modeInfo.icons);
    void toggleCSS(tabId, mode)
        .catch(error => {
        console.log('Unable to toggle dark mode, content script not yet available', error);
    });
};
const savePreference = (url, preference) => {
    const origin = getOrigin(url);
    const newPreference = {
        [origin]: preference
    };
    return chrome.storage.local.set(newPreference);
};
const getPreference = (tabId, url) => {
    const origin = getOrigin(url);
    chrome.storage.local.get(origin, (storedPreferences) => {
        const preference = storedPreferences[origin];
        if (preference) {
            void setMode(tabId, preference);
        }
    });
};
const getOrigin = (url) => {
    return new URL(url).origin;
};
