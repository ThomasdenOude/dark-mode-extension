// In light mode: show moon icon
const toDarkTitle = "Set dark mode";
const darkIcons = {
    16: "images/moon-16.png",
    32: "images/moon-32.png",
    48: "images/moon-48.png",
    128: "images/moon-128.png"
}

// In dark mode: show sun icon
const toLightTitle = "Set light mode";
const lightIcons = {
    16: "images/sun-16.png",
    32: "images/sun-32.png",
    48: "images/sun-48.png",
    128: "images/sun-128.png"
}

chrome.action.onClicked.addListener(async (tab) => {
    // Retrieve the current title
    const currentTitle = await chrome.action.getTitle({ tabId: tab.id });
    // Select the next title and next icon
    const nextTitle = currentTitle === toDarkTitle ? toLightTitle : toDarkTitle;
    const nextIcon = currentTitle === toDarkTitle ? lightIcons : darkIcons;

    // Set the action tooltip to the next title
    await chrome.action.setTitle({
        tabId: tab.id,
        title: nextTitle,
    });

    // Set the action icon to the next icon
    await chrome.action.setIcon({
        path: nextIcon,
        tabId: tab.id
    })

    if (currentTitle === toDarkTitle) {
        // Insert the dark mode CSS
        await chrome.scripting.insertCSS({
            files: ["styles/dark-mode.css"],
            target: { tabId: tab.id },
        });
    } else {
        // Remove the dark mode CSS
        await chrome.scripting.removeCSS({
            files: ["styles/dark-mode.css"],
            target: { tabId: tab.id },
        });
    }
});
