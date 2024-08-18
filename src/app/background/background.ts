import "../../styles.scss";
import { Icons } from "./models/icons";
import { Mode, ModeInfo, ModePreferences } from "./models/mode";
import { darkMode, lightMode } from "./constants/mode-info";

chrome.action.onClicked.addListener((tab) => {
  // Respond to click on extension icon
  const { id, url } = tab;
  if (id) {
    // Get the current title
    chrome.action.getTitle({ tabId: id }).then((title) => {
      // Select the next mode
      const nextMode: Mode = title === lightMode.title ? "dark" : "light";

      void setMode(id, nextMode);

      // Save preference for this website
      if (url) {
        void savePreference(url, nextMode);
      }
    });
  }
});

chrome.tabs.onCreated.addListener(async (tab) => {
  const { id, url } = tab;
  // Respond to creating a new tab
  if (id && url) {
    // Get preference for this website
    getPreference(id, url);
  }
});

chrome.tabs.onUpdated.addListener((tabId: number, changeInfo, tab) => {
  // Respond to changes in url or page refresh
  const url: string | undefined = tab.url ?? changeInfo.url;

  if (tabId && url) {
    // Get preference for this website
    getPreference(tabId, url);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  const { tabId } = activeInfo;
  // Respond to tab switch
  chrome.tabs.get(tabId, function (tab) {
    if (tabId && tab.url) {
      // Get preference for this website
      getPreference(tabId, tab.url);
    }
  });
});

const setTitle = (tabId: number, nextTitle: string): Promise<void> => {
  return chrome.action.setTitle({
    tabId: tabId,
    title: nextTitle,
  });
};

const setIcon = (tabId: number, nextIcon: Icons): Promise<void> => {
  return chrome.action.setIcon({
    tabId: tabId,
    path: nextIcon,
  });
};

const sendModePreferenceMessage = (
  tabId: number,
  mode: Mode,
): Promise<void> => {
  return chrome.tabs.sendMessage(tabId, { mode: mode });
};

const setMode = (tabId: number, mode: Mode): void => {
  const modeInfo: ModeInfo = mode === "dark" ? darkMode : lightMode;
  void setTitle(tabId, modeInfo.title);
  void setIcon(tabId, modeInfo.icons);
  void sendModePreferenceMessage(tabId, mode).catch((error) => {
    console.log(
      "Unable to toggle dark mode, content script not yet available",
      error,
    );
  });
};

const savePreference = (url: string, preference: Mode): Promise<void> => {
  const origin = getOrigin(url);
  const newPreference: ModePreferences = {
    [origin]: preference,
  };

  return chrome.storage.local.set(newPreference);
};

const getPreference = (tabId: number, url: string): void => {
  const origin = getOrigin(url);

  // Get preference for this website, and set dark or light mode according to preference
  chrome.storage.local.get(origin, (storedPreferences: ModePreferences) => {
    const preference: Mode | undefined = storedPreferences[origin];

    if (preference) {
      void setMode(tabId, preference);
    }
  });
};

const getOrigin = (url: string): string => {
  return new URL(url).origin;
};
