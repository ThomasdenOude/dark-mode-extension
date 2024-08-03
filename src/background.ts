type Icon = {
    16: string;
    32: string;
    48: string;
    128: string;
}

const toDarkTitle = "Set dark mode";
const darkIcons: Icon = {
    16: "src/images/moon-16.png",
    32: "src/images/moon-32.png",
    48: "src/images/moon-48.png",
    128: "src/images/moon-128.png"
}

// In dark mode: show sun icon
const toLightTitle = "Set light mode";
const lightIcons: Icon = {
    16: "src/images/sun-16.png",
    32: "src/images/sun-32.png",
    48: "src/images/sun-48.png",
    128: "src/images/sun-128.png"
}

chrome.action.onClicked.addListener(async (tab) => {
    // Check if tab.id is available
    const currentTabId: number | undefined = tab.id;
    if (currentTabId) {
        // Retrieve the current title
        const currentTitle = await chrome.action.getTitle({ tabId: currentTabId});
        // Select the next title and next icon
        const nextTitle = currentTitle === toDarkTitle ? toLightTitle : toDarkTitle;
        const nextIcon = currentTitle === toDarkTitle ? lightIcons : darkIcons;

        // Set the action tooltip to the next title
        await setTitle(currentTabId, nextTitle);

        // Set the action icon to the next icon
        await setIcon(currentTabId, nextIcon);

        // Toggle dark mode styling
        await toggleCSS(currentTabId,  currentTitle === toDarkTitle)
    }
});

const setTitle = (tabId: number, nextTitle: string): Promise<void> => {
    return chrome.action.setTitle({
        tabId: tabId,
        title: nextTitle,
    });
}

const setIcon = (tabId: number, nextIcon: Icon): Promise<void> => {
    return chrome.action.setIcon({
        tabId: tabId,
        path: nextIcon
    })
}

const toggleCSS = (tabId: number, toDarkStyling: boolean): Promise<void> => {
    if (toDarkStyling) {
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
