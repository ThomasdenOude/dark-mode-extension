import {
  elementHasDarkModeStyling,
  isHTMLElement,
} from "../helpers/element/element";
import { CLASS_PREFIX } from "../constants/class-prefix";
import { DarkModeBackground, DarkModeText } from "../models/dark-mode-classes";
import { getBackgroundClass, getTextClass } from "../helpers/color/color";

/**
 * Add dark mode classes for background and text color to element
 */
export function addDarkModeClasses(element: HTMLElement): void {
  const classList: string[] = [CLASS_PREFIX];

  const backgroundColor: string = getComputedStyle(element).backgroundColor;
  const backgroundClass: DarkModeBackground | undefined =
    getBackgroundClass(backgroundColor);
  if (backgroundClass) {
    classList.push(CLASS_PREFIX + "-" + backgroundClass);
  }
  const textColor = getComputedStyle(element).color;
  const textColorClass: DarkModeText | undefined = getTextClass(textColor);
  if (textColorClass) {
    classList.push(CLASS_PREFIX + "-" + textColorClass);
  }
  element.classList.add(...classList);
}

/**
 *  Add dark mode classes for all child elements of the body,
 *
 */
export function setDarkMode(body: HTMLBodyElement): void {
  const elements: NodeListOf<Element> = body.querySelectorAll<Element>("*");
  elements.forEach((element) => {
    if (isHTMLElement(element) && !elementHasDarkModeStyling(element)) {
      addDarkModeClasses(element);
    }
  });
}

/**
 * Callback for mutation observer
 *
 * Add dark mode classes for every newly added HTMLElement
 */
export const setDarkModeForNewElements = (
  mutationList: MutationRecord[],
): void => {
  for (const mutation of mutationList) {
    const addedNodes = mutation.addedNodes;
    if (addedNodes.length) {
      addedNodes.forEach((node: null | Node | HTMLElement) => {
        if (isHTMLElement(node) && !elementHasDarkModeStyling(node)) {
          addDarkModeClasses(node);
        }
      });
    }
  }
};
