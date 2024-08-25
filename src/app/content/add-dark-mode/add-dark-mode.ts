import { CLASS_PREFIX } from "../../shared/constants/class-prefix";
import { isColored } from "../helpers/color/color";

/**
 *  Add dark mode classes for all child elements of the body,
 *
 */
export function addColoredBackgroundClass(body: HTMLBodyElement): void {
  const elements: NodeListOf<Element> = body.querySelectorAll<Element>("*");
  elements.forEach((element) => {
    if (element instanceof HTMLElement) {
      const backgroundColorString: string =
        getComputedStyle(element).backgroundColor;
      const isColoredElement: boolean = isColored(backgroundColorString);
      if (isColoredElement) {
        element.classList.add(CLASS_PREFIX + "-colored-background");
      }
    }
  });
}
