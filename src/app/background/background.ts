import "../../styles.scss";
import browser from "webextension-polyfill";
import { Icons } from "./models/icons";
import { ModeInfo } from "./models/mode";
import { Mode } from "../shared/models/mode";
import {
  CurrentModeResponse,
  UpdateModeMessages,
} from "../shared/models/messages";
import { DarkMode, LightMode } from "./constants/mode-info";

browser.action.onClicked.addListener((tab) => {
  // Respond to click on the extension icon
  const { id } = tab;
  if (id) {
    // Get the current title
    browser.action.getTitle({ tabId: id }).then(async (title) => {
      // Select the next mode
      const changeMode: Mode =
        title === LightMode.title ? Mode.Dark : Mode.Light;

      const currentMode: Mode | undefined = await changeModeRequest(
        id,
        changeMode,
      );
      if (currentMode) {
        await setMode(id, currentMode);
      }
    });
  }
});

browser.tabs.onCreated.addListener(async (tab) => {
  const { id } = tab;
  // Respond to creating a new tab
  if (id) {
    // Get preference for this website
    await setModePreference(id);
  }
});

browser.tabs.onUpdated.addListener(async (tabId: number) => {
  // Respond to changes in url or page refresh

  if (tabId) {
    // Get preference for this website
    await setModePreference(tabId);
  }
});

browser.tabs.onActivated.addListener((activeInfo) => {
  const { tabId } = activeInfo;
  // Respond to tab switch
  browser.tabs.get(tabId).then(async () => {
    if (tabId) {
      // Get preference for this website
      await setModePreference(tabId, true);
    }
  });
});

const setTitle = (tabId: number, nextTitle: string): Promise<void> => {
  return browser.action.setTitle({
    tabId: tabId,
    title: nextTitle,
  });
};

const setIcon = (tabId: number, nextIcon: Icons): Promise<void> => {
  return browser.action.setIcon({
    tabId: tabId,
    path: nextIcon,
  });
};

const setMode = async (tabId: number, mode: Mode): Promise<void> => {
  const modeInfo: ModeInfo = mode === Mode.Dark ? DarkMode : LightMode;
  void setTitle(tabId, modeInfo.title);
  void setIcon(tabId, modeInfo.icons);
};

const changeModeRequest = async (
  tabId: number,
  mode: Mode,
): Promise<Mode | undefined> => {
  const message: UpdateModeMessages = { changeMode: mode };
  try {
    const response: CurrentModeResponse = await browser.tabs.sendMessage(
      tabId,
      message,
    );
    return response?.currentMode;
  } catch (error) {
    console.log(
      "Unable to change mode preference, content script not yet available",
      error,
    );
    return;
  }
};

const getModePreference = async (
  tabId: number,
  message: UpdateModeMessages,
): Promise<Mode | undefined> => {
  try {
    const response: CurrentModeResponse | void = await browser.tabs.sendMessage(
      tabId,
      message,
    );
    return response?.currentMode;
  } catch (error) {
    console.log(
      "Unable to get mode preference, content script not yet available",
      error,
    );
    return;
  }
};

const setModePreference = async (
  tabId: number,
  update?: boolean,
): Promise<void> => {
  const message: UpdateModeMessages = update
    ? { updateMode: true }
    : { requestMode: true };

  const modePreference = await getModePreference(tabId, message);
  if (modePreference) {
    await setMode(tabId, modePreference);
  }
};
