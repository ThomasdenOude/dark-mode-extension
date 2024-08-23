import { ColorRgb } from "../../models/color-rgb";
import { DarkModeBackground } from "../../models/dark-mode-classes";

/**
 * returns the color that is applied to an element in r, g, b values
 *
 * @param colorString - the css color string from:
 *  - element.style.color
 *  - element.style.backgroundColor
 */
export function getRgb(colorString: string): undefined | ColorRgb {
  const rgbaStrings = colorString.split("(")[1]?.split(")")[0]?.split(",");

  if (!rgbaStrings) {
    return;
  }
  const a: number = Number(rgbaStrings[3]);
  if (a === 0) {
    return;
  }
  const r: number = Number(rgbaStrings[0]);
  const g: number = Number(rgbaStrings[1]);
  const b: number = Number(rgbaStrings[2]);

  return {
    r: removeAlpha(r, a),
    g: removeAlpha(g, a),
    b: removeAlpha(b, a),
  };
}

/**
 * Remove alpha chanel from color
 *
 * Calculate color value as if it has a white background
 */
function removeAlpha(c: number, a: number | undefined): number {
  return a ? c + (255 - c) * (1 - a) : c;
}

function isAlmostGreyScale(r: number, g: number, b: number): boolean {
  return Math.abs(r - g) < 20 && Math.abs(r - b) < 20;
}

/**
 * Return class name for dark mode styling based on element background color
 *
 * @param backgroundColor - the css color string from:
 *  - element.style.backgroundColor
 */
export function getBackgroundClass(
  backgroundColor: string,
): DarkModeBackground | undefined {
  const backgroundRgb: ColorRgb | undefined = getRgb(backgroundColor);
  if (!backgroundRgb) {
    return;
  }
  const { r, g, b } = backgroundRgb;

  if (r < 51 && g < 51 && b < 51) {
    return "light";
  }

  if (r < 120 && isAlmostGreyScale(r, g, b)) {
    return "light-mid";
  }
  if (r < 204 && isAlmostGreyScale(r, g, b)) {
    return "dark-mid";
  }
  if (r >= 204 && g >= 204 && b >= 204) {
    return "dark";
  }
  return "colored-background";
}
