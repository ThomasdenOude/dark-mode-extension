import { CLASS_PREFIX } from "../shared/constants/class-prefix";
import {
  addDarkModeClassesToChildren,
  setDarkModeForNewElements,
} from "./add-dark-mode/add-dark-mode";
import { Mode } from "../shared/models/mode";
import {
  CurrentModeResponse,
  UpdateModeMessages,
} from "../shared/models/messages";
import MessageSender = chrome.runtime.MessageSender;
import { MUTATION_CONFIG } from "./constants/mutation-config";

const activeClass = CLASS_PREFIX + "-active";
const preferenceKey = CLASS_PREFIX + "-preference";

const body: HTMLBodyElement | null = document.querySelector("body");
const html: HTMLHtmlElement | null = document.querySelector("html");

const observer: MutationObserver = new MutationObserver(
  setDarkModeForNewElements,
);
if (body && html) {
  const preference: Mode = getPreference();
  setMode(preference, body, html);

  const updateMode = (
    message: UpdateModeMessages,
    sender: MessageSender,
    sendResponse: (response: CurrentModeResponse) => void,
  ): void => {
    let preference: Mode = getPreference();

    if (message.changeMode) {
      preference = message.changeMode;
      setPreference(preference);
    }

    setMode(preference, body, html, message.updateMode ?? false);

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
  html: HTMLHtmlElement,
  update?: boolean,
): void {
  const isDarkMode: boolean = body.classList.contains(activeClass);

  if (mode === Mode.Dark && (update || !isDarkMode)) {
    html.classList.add(activeClass);
    body.classList.add(activeClass);

    addDarkModeClassesToChildren(body);

    observer.observe(body, MUTATION_CONFIG);
  }
  if (mode === Mode.Light && (update || isDarkMode)) {
    html.classList.remove(activeClass);
    body.classList.remove(activeClass);
    observer.disconnect();
  }
}
