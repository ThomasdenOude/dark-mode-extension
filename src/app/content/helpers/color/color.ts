import { ColorRgb } from "../../models/color-rgb";
import {
  DarkModeBackground,
  DarkModeText,
} from "../../models/dark-mode-classes";

/**
 * returns the color that is applied to an element in r, g, b, a values
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

function removeAlpha(c: number, a: number | undefined): number {
  // Transparency of element when it would have a white background
  return a ? c + (255 - c) * (1 - a) : c;
}

export function getBackgroundGrayScaleClass(
  grayscale: number,
): DarkModeBackground {
  if (grayscale < 51) {
    return "light";
  }
  if (grayscale < 102) {
    return "light-mid";
  }
  if (grayscale < 153) {
    return "keep-background";
  }
  if (grayscale < 204) {
    return "dark-mid";
  }
  return "dark";
}

export function getBackgroundColorClass(
  r: number,
  g: number,
  b: number,
): DarkModeBackground {
  if (r < 51 && g < 51 && b < 51) {
    return "light";
  }
  if (r > 204 && g > 204 && b > 204) {
    return "dark-mid";
  }

  return "keep-background";
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
  let backgroundClass: DarkModeBackground;
  const backgroundRgb: ColorRgb | undefined = getRgb(backgroundColor);
  if (!backgroundRgb) {
    return;
  }
  const { r, g, b } = backgroundRgb;
  if (r === g && r === b) {
    backgroundClass = getBackgroundGrayScaleClass(r);
  } else {
    backgroundClass = getBackgroundColorClass(r, g, b);
  }
  return backgroundClass;
}
export function getTextColorClass(
  r: number,
  g: number,
  b: number,
): DarkModeText {
  if (r < 51 && g < 51 && b < 51) {
    return "dark-text";
  }
  if (r > 204 && g > 204 && b > 204) {
    return "light-text";
  }
  return "keep-text";
}

/**
 * Return class name for dark mode styling based on element text color
 *
 * @param textColor - the css color string from:
 *  - element.style.color
 * @return DarkModeText - for colored text or else undefined
 */
export function getTextClass(textColor: string): DarkModeText | undefined {
  const textRgba: ColorRgb | undefined = getRgb(textColor);
  if (!textRgba) {
    return;
  }
  const { r, g, b } = textRgba;
  if (r === g && r === b) {
    return;
  }
  return getTextColorClass(r, g, b);
}
