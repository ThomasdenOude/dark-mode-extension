type Icons = {
    16: string;
    32: string;
    48: string;
    128: string;
}
type Mode = 'light' | 'dark';

type ModeInfo = {
    mode: Mode;
    title: string;
    icons: Icons;
}
type Preferences = {
    [key: string]: Mode
}

// In light mode show dark icon ( moon )
const darkIcons: Icons = {
    16: "src/images/moon-16.png",
    32: "src/images/moon-32.png",
    48: "src/images/moon-48.png",
    128: "src/images/moon-128.png"
}
const darkMode: ModeInfo = {
    mode: "dark",
    title: "Switch to light mode",
    icons: darkIcons
}

// In dark mode: show light icon ( sun )
const lightIcons: Icons = {
    16: "src/images/sun-16.png",
    32: "src/images/sun-32.png",
    48: "src/images/sun-48.png",
    128: "src/images/sun-128.png"
}
const lightMode: ModeInfo = {
    mode: "light",
    title: "Switch to dark mode",
    icons: lightIcons
}

chrome.action.onClicked.addListener(async (tab) => {
    // Check if tab.id is available
    const currentTabId: number | undefined = tab.id;
    if (currentTabId) {
        // Get the current title
        const currentTitle = await chrome.action.getTitle({ tabId: currentTabId});
        // Select the next mode
        const nextMode: ModeInfo = currentTitle === lightMode.title ? darkMode : lightMode;

        // Set the action tooltip to the next title
        await setTitle(currentTabId, nextMode.title);

        // Set the action icon to the next icon
        await setIcon(currentTabId, nextMode.icons);

        // Toggle dark mode styling
        await toggleCSS(currentTabId,  nextMode.mode);

        // Save preference for this website
        if (tab.url) {
            await setPreference(tab.url, nextMode.mode);
        }
    }
});

chrome.tabs.onCreated.addListener((tab) => {
    if (tab.id && tab.url) {
        // Get preference for this website
        getPreference(tab.id, tab.url);
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.url) {
        // Get preference for this website
        getPreference(tabId, tab.url);
    }
});

const setTitle = (tabId: number, nextTitle: string): Promise<void> => {
    return chrome.action.setTitle({
        tabId: tabId,
        title: nextTitle,
    });
}

const setIcon = (tabId: number, nextIcon: Icons): Promise<void> => {
    return chrome.action.setIcon({
        tabId: tabId,
        path: nextIcon
    })
}

const toggleCSS = (tabId: number, mode: Mode): Promise<void> => {
    if (mode === 'dark') {
        return chrome.scripting.insertCSS({
            files: ["src/styles/dark-mode.css"],
            target: { tabId: tabId },
        });
    } else {
        return chrome.scripting.removeCSS({
            files: ["src/styles/dark-mode.css"],
            target: { tabId: tabId },
        });
    }
}

const setPreference = (url: string, preference: Mode): Promise<void> => {
    const origin = getOrigin(url)
    const newPreference: Preferences = {
        [ origin ]: preference
    };

    return chrome.storage.local.set(newPreference)
}

const getPreference = (tabId: number, url: string): void => {
    const origin = getOrigin(url);

    // Get preference for this website, and set dark or light mode according to preference
    chrome.storage.local.get(origin, async (storedPreferences: Preferences) => {
        const preference: Mode | undefined = storedPreferences[origin];

        if (preference) {
            const preferredMode = preference === 'dark' ? darkMode : lightMode
            await setTitle(tabId, preferredMode.title);
            await setIcon(tabId, preferredMode.icons);
            await toggleCSS(tabId, preferredMode.mode);
        }
    })
}

const getOrigin = (url: string): string =>{
    const urlObject: URL = new URL(url);

    return urlObject.origin
}
