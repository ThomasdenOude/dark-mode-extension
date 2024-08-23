import { CLASS_PREFIX } from "../shared/constants/class-prefix";
import { MUTATION_CONFIG } from "./constants/mutation-config";
import {
  addDarkModeClassesToBody,
  setDarkModeForNewElements,
} from "./add-dark-mode/add-dark-mode";
import { Mode } from "../shared/models/mode";
import {
  ChangeModeMessage,
  CurrentModeResponse,
  isChangeModeMessage,
  RequestModeMessage,
} from "../shared/models/messages";
import MessageSender = chrome.runtime.MessageSender;

const activeClass = CLASS_PREFIX + "-active";
const preferenceKey = CLASS_PREFIX + "-preference";

const body: HTMLBodyElement | null = document.querySelector("body");
const observer: MutationObserver = new MutationObserver(
  setDarkModeForNewElements,
);

if (body) {
  const preference: Mode = getPreference();
  setMode(preference, body, observer);

  const updateMode = (
    message: RequestModeMessage | ChangeModeMessage,
    sender: MessageSender,
    sendResponse: (response: CurrentModeResponse) => void,
  ): void => {
    let preference: Mode = getPreference();

    if (isChangeModeMessage(message)) {
      preference = message.changeMode;
      setPreference(preference);
    }

    setMode(preference, body, observer);

    return sendResponse({ currentMode: preference });
  };

  chrome.runtime.onMessage.addListener(updateMode);
}

function getPreference(): Mode {
  const preference = localStorage.getItem(preferenceKey);

  return preference === Mode.Dark ? Mode.Dark : Mode.Light;
}

function setPreference(mode: Mode): void {
  localStorage.setItem(preferenceKey, mode);
}

function setMode(
  mode: Mode,
  body: HTMLBodyElement,
  observer: MutationObserver,
): void {
  const isDarkMode: boolean = body.classList.contains(activeClass);
  if (mode === Mode.Dark && !isDarkMode) {
    body.classList.add(activeClass);

    addDarkModeClassesToBody(body);
    observer.observe(body, MUTATION_CONFIG);
  }
  if (mode === Mode.Light && isDarkMode) {
    body.classList.remove(activeClass);

    observer.disconnect();
  }
}
