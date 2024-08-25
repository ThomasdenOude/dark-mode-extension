import { CLASS_PREFIX } from "../shared/constants/class-prefix";
import { addColoredBackgroundClass } from "./add-dark-mode/add-dark-mode";
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
const html: HTMLHtmlElement | null = document.querySelector("html");

if (body && html) {
  const preference: Mode = getPreference();
  setMode(preference, body, html);

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

    setMode(preference, body, html);

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
): void {
  const isDarkMode: boolean = body.classList.contains(activeClass);
  if (mode === Mode.Dark) {
    addColoredBackgroundClass(body);
    html.classList.add(activeClass);
    body.classList.add(activeClass);
  }
  if (mode === Mode.Light && isDarkMode) {
    html.classList.remove(activeClass);
    body.classList.remove(activeClass);
  }
}
