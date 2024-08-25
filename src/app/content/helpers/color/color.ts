/**
 * returns the color that is applied to an element in r, g, b values
 *
 * @param colorString - the css color string from:
 *  - element.style.color
 *  - element.style.backgroundColor
 */
export function isColored(colorString: string): boolean {
  const rgbaStrings = colorString.split("(")[1]?.split(")")[0]?.split(",");

  if (!rgbaStrings) {
    return false;
  }
  const a: number = Number(rgbaStrings[3]);
  if (a === 0) {
    return false;
  }
  const r: number = Number(rgbaStrings[0]);
  const g: number = Number(rgbaStrings[1]);
  const b: number = Number(rgbaStrings[2]);

  return (
    hasColorDifference(r, g) ||
    hasColorDifference(r, b) ||
    hasColorDifference(g, b)
  );
}

function hasColorDifference(a: number, b: number): boolean {
  return Math.abs(a - b) > 80;
}
