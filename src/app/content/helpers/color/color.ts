import { DarkModeClasses } from "../../models/dark-mode-classes";

/**
 * returns the dark mode class for the background color of this element
 *  - 'colored' for elements that have a colored background
 *  - a grey scale class for elements that are black or white or ( almost ) grey
 *
 * @param colorString - the css color string from:
 *  - element.style.backgroundColor
 */
export function getDarkModeClass(colorString: string): DarkModeClasses | null {
  const rgbaStrings: string[] | undefined = colorString
    .split("(")[1]
    ?.split(")")[0]
    ?.split(",");

  if (!rgbaStrings) {
    return null;
  }
  const a: number = Number(rgbaStrings[3]);
  /**
   * If element is fully transparent, no classes are applied */
  if (a === 0) {
    return null;
  }
  const r: number = Number(rgbaStrings[0]);
  const g: number = Number(rgbaStrings[1]);
  const b: number = Number(rgbaStrings[2]);

  if (hasColorDifference(r, g, b)) {
    return "colored";
  }
  let grey = Math.round((r + g + b) / 3);

  /**
   * If element has some transparency, convert to solid color
   * Element is treated as if it would have a white background
   *
   * @example
   *
   *  - Element is black,
   *  - and is 50% transparent ( a = 0.5 )
   *
   *  Resulting greyscale will be 127, corresponding to rgb(127, 127, 127);
   */
  if (!isNaN(a) && a < 1) {
    grey += (255 - grey) * (1 - a);
  }
  if (grey > 250) {
    return "black";
  }
  if (grey > 225) {
    return "dark-grey";
  }
  if (grey > 200) {
    return "mid-grey";
  }
  return "light-grey";
}

/**
 * Only true if color values differ more than 80
 *
 * @remarks If color values differ less this element will be treated as greyscale
 */
export function hasColorDifference(r: number, g: number, b: number): boolean {
  return Math.abs(r - g) > 80 || Math.abs(r - b) > 80 || Math.abs(g - b) > 80;
}
