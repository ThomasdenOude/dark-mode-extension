import { CLASS_PREFIX } from "../../shared/constants/class-prefix";
import { isColored } from "../helpers/color/color";

/**
 *  Add dark mode classes for all child elements of the body,
 *
 */
export function addDarkModeClassesToChildren(htmlElement: HTMLElement): void {
  const elements: NodeListOf<Element> =
    htmlElement.querySelectorAll<Element>("*");
  elements.forEach((element) => {
    if (element instanceof HTMLElement) {
      addDarkModeClassesToElement(element);
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
        if (node instanceof HTMLElement && !node.classList.contains("dm-ext")) {
          addDarkModeClassesToElement(node);
          addDarkModeClassesToChildren(node);
        }
      });
    }
  }
};

function addDarkModeClassesToElement(element: HTMLElement) {
  const darkModeClasses = [CLASS_PREFIX];
  const backgroundColorString: string =
    getComputedStyle(element).backgroundColor;
  const isColoredElement: boolean = isColored(backgroundColorString);
  if (isColoredElement) {
    darkModeClasses.push(CLASS_PREFIX + "-colored-background");
  }
  element.classList.add(...darkModeClasses);
}
