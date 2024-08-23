import { CLASS_PREFIX } from "../../shared/constants/class-prefix";
import { DarkModeBackground } from "../models/dark-mode-classes";
import { getBackgroundClass } from "../helpers/color/color";

/**
 * Add dark mode classes for background and text color to element
 */
export function addDarkModeClassesToElement(
  element: null | Node | Element | HTMLElement,
): void {
  if (
    element instanceof HTMLElement &&
    !element.classList.contains(CLASS_PREFIX)
  ) {
    const backgroundColorString: string =
      getComputedStyle(element).backgroundColor;
    const backgroundClass: DarkModeBackground | undefined = getBackgroundClass(
      backgroundColorString,
    );
    if (backgroundClass) {
      element.classList.add(CLASS_PREFIX, CLASS_PREFIX + "-" + backgroundClass);
    }
  }
}

/**
 *  Add dark mode classes for all child elements of the body,
 *
 */
export function addDarkModeClassesToBody(body: HTMLBodyElement): void {
  const elements: NodeListOf<Element> = body.querySelectorAll<Element>("*");
  elements.forEach((element) => {
    addDarkModeClassesToElement(element);
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
        addDarkModeClassesToElement(node);
      });
    }
  }
};
