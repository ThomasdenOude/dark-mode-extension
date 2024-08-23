import { CLASS_PREFIX } from "../../../shared/constants/class-prefix";

/**
 * HTMLElement type guard
 *
 * Exclude from dark mode styling
 *  - textNode
 *  - comment
 *  - svg elements
 */
export function isHTMLElement(
  node: null | Node | Element | HTMLElement,
): node is HTMLElement {
  return node instanceof HTMLElement;
}

/**
 * Check if element already has dark mode classes added
 */
export function elementHasDarkModeStyling(element: HTMLElement): boolean {
  return element.classList.contains(CLASS_PREFIX);
}
