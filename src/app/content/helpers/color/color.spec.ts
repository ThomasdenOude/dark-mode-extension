import { getRgb } from "./color";
import { ColorRgb } from "../../models/color-rgb";

describe("Color", () => {
  describe("getRgba", () => {
    it("returns undefined if string is empty", () => {
      const result = getRgb("");
      expect(result).toBeUndefined();
    });

    it("returns undefined if string is not a color string", () => {
      const result = getRgb("Life is full of color");
      expect(result).toBeUndefined();
    });

    it("returns rgb values for colored element", () => {
      const expected: ColorRgb = { r: 10, g: 20, b: 30 };
      const result = getRgb("rgb(10, 20, 30");
      expect(result).toEqual(expected);
    });

    it("returns rgb values for colored element, fully opaque", () => {
      const expected: ColorRgb = { r: 10, g: 20, b: 30 };
      const result = getRgb("rgba(10, 20, 30, 1");
      expect(result).toEqual(expected);
    });

    it("returns rgb values for colored element, with transparency converted to white", () => {
      const expected: ColorRgb = { r: 205, g: 215, b: 195 };
      const result = getRgb("rgba(155, 175, 135, 0.5");
      expect(result).toEqual(expected);
    });

    it("returns undefined for fully transparent elements", () => {
      const result = getRgb("rgba(10, 20, 30, 0");
      expect(result).toBeUndefined();
    });
  });
});
