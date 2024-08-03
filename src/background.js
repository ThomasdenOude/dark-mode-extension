var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { toDarkTitle, darkIcons, toLightTitle, lightIcons } from "./data/icon.data";
chrome.action.onClicked.addListener((tab) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTabId = tab.id;
    if (currentTabId) {
        const currentTitle = yield chrome.action.getTitle({ tabId: currentTabId });
        const nextTitle = currentTitle === toDarkTitle ? toLightTitle : toDarkTitle;
        const nextIcon = currentTitle === toDarkTitle ? lightIcons : darkIcons;
        yield setTitle(currentTabId, nextTitle);
        yield setIcon(currentTabId, nextIcon);
        yield toggleCSS(currentTabId, currentTitle === toDarkTitle);
    }
}));
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
const toggleCSS = (tabId, toDarkStyling) => {
    if (toDarkStyling) {
        return chrome.scripting.insertCSS({
            files: ["styles/dark-mode.css"],
            target: { tabId: tabId },
        });
    }
    else {
        return chrome.scripting.removeCSS({
            files: ["styles/dark-mode.css"],
            target: { tabId: tabId },
        });
    }
};
