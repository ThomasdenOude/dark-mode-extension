import MessageSender = chrome.runtime.MessageSender;

import { getDarkModeClass } from "../helpers/color/color";
import { getPreference, setPreference } from "../helpers/preference-storage";
import { DarkModeClasses } from "../models/dark-mode-classes";
import { Mode } from "../../shared/models/mode";
import { MUTATION_CONFIG } from "../constants/mutation-config";
import { CLASS_PREFIX } from "../../shared/constants/class-prefix";

import {
  CurrentModeResponse,
  UpdateModeMessages,
} from "../../shared/models/messages";

const activeClass = CLASS_PREFIX + "-active";

/**
 * Add dark mode classes to element
 *
 * @default css class is 'dm-ext'.
 *  - Other dark mode classes are optional
 *  - All dark mode classes are prefixed with 'dm-ext'
 */
export function addDarkModeClassesToElement(element: HTMLElement) {
  const darkModeClasses = [CLASS_PREFIX];
  const backgroundColorString: string =
    getComputedStyle(element).backgroundColor;
  const darkModeClass: DarkModeClasses | null = getDarkModeClass(
    backgroundColorString,
  );
  if (darkModeClass) {
    darkModeClasses.push(CLASS_PREFIX + "-" + darkModeClass);
  }
  element.classList.add(...darkModeClasses);
}

/**
 *  Add dark mode classes for all child elements,
 *
 *   - Only applied to HTML elements
 *   - If element already has dark mode styling, they will be ignored
 *
 */
export function addDarkModeClassesToChildren(htmlElement: HTMLElement): void {
  const elements: NodeListOf<Element> =
    htmlElement.querySelectorAll<Element>("*");
  elements.forEach((element) => {
    if (
      element instanceof HTMLElement &&
      !element.classList.contains("dm-ext")
    ) {
      addDarkModeClassesToElement(element);
    }
  });
}

/**
 * add dark mode classes to element and to all children
 */
export function addDarkModeClasses(element: HTMLElement): void {
  addDarkModeClassesToElement(element);
  addDarkModeClassesToChildren(element);
}

/**
 * Callback for mutation observer
 *
 * Add dark mode classes for
 *  - Every newly added HTMLElement
 *  - And to the children of that element
 */
export const darkModeClassesObserver = (
  mutationList: MutationRecord[],
): void => {
  for (const mutation of mutationList) {
    const addedNodes = mutation.addedNodes;

    if (addedNodes.length) {
      addedNodes.forEach((node: null | Node | HTMLElement) => {
        if (node instanceof HTMLElement && !node.classList.contains("dm-ext")) {
          addDarkModeClasses(node);
        }
      });
    }
  }
};

/**
 * Toggle between dark mode and light mode
 */
export function setMode(
  mode: Mode,
  body: HTMLBodyElement,
  html: HTMLHtmlElement,
  observer: MutationObserver,
  update?: boolean,
): void {
  const isDarkMode: boolean = body.classList.contains(activeClass);

  /**
   * Don't run add Dark mode logic if page is already in dark mode,
   * unless an update is needed
   */
  if (mode === Mode.Dark && (update || !isDarkMode)) {
    addDarkModeClasses(body);

    html.classList.add(activeClass);
    body.classList.add(activeClass);

    observer.observe(body, MUTATION_CONFIG);
  }
  if (mode === Mode.Light && (update || isDarkMode)) {
    html.classList.remove(activeClass);
    body.classList.remove(activeClass);
    observer.disconnect();
  }
}

/**
 * Set the mode according to the user preference ( preference state is kept by the content script )
 *
 * After that, listen for messages from the background script
 *  1. Notify background script of current mode preference
 *  2. After user clicks extension icon, change preference accordingly {@link UpdateModeMessages.changeMode}
 *  3. If user changed tab and returns to this tab, update preference {@link UpdateModeMessages.updateMode}
 */
export function initModePreference(
  body: HTMLBodyElement,
  html: HTMLHtmlElement,
  observer: MutationObserver,
): void {
  const preference: Mode = getPreference();
  setMode(preference, body, html, observer);

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
    setMode(preference, body, html, observer, message.updateMode ?? false);

    return sendResponse({ currentMode: preference });
  };

  chrome.runtime.onMessage.addListener(updateMode);
}
