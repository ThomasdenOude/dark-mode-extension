import { isHTMLElement, elementHasDarkModeStyling } from "./element";

describe("Element", () => {
  describe("isHtmlElement", () => {
    let node: Node | null = null;

    it("returns false if no node provided", () => {
      const result = isHTMLElement(node);
      // Assert
      expect(result).toBe(false);
    });

    it("returns false if node is a text node", () => {
      node = document.createComment("test");
      const result = isHTMLElement(node);
      // Assert
      expect(result).toBe(false);
    });

    it("returns false if node is a comment", () => {
      node = document.createComment("test");
      const result = isHTMLElement(node);
      // Assert
      expect(result).toBe(false);
    });

    it("returns false if node is a SVGElement", () => {
      const svg: SVGElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      const result = isHTMLElement(svg);
      // Assert
      expect(result).toBe(false);
    });

    it("returns true if node is a HTMLElement", () => {
      const div = document.createElement("div");
      const result = isHTMLElement(div);
      // Assert
      expect(result).toBe(true);
    });
  });

  describe("elementHasDarkModeStyling", () => {
    it("returns false if element has no class added", () => {
      const div = document.createElement("div");
      const result = elementHasDarkModeStyling(div);
      // Assert
      expect(result).toBe(false);
    });

    it("returns false if element has a normal class added", () => {
      const div = document.createElement("div");
      div.classList.add("some-class");
      const result = elementHasDarkModeStyling(div);
      // Assert
      expect(result).toBe(false);
    });
    it("returns true if element has a dark mode class added", () => {
      const div = document.createElement("div");
      div.classList.add("some-class", "dm-ext-dark", "dm-ext-light");
      const result = elementHasDarkModeStyling(div);
      // Assert
      expect(result).toBe(true);
    });
  });
});
