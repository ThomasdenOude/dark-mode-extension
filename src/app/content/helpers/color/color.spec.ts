import { getDarkModeClass } from "./color";

describe("Color", () => {
  it("returns null for non valid color string", () => {
    const result = getDarkModeClass("non-valid");
    expect(result).toBe(null);
  });

  it("returns null if color is transparent", () => {
    const result = getDarkModeClass("rgba(200, 30, 80, 0");
    expect(result).toBe(null);
  });

  it('returns "black" if color rgb is 255, 255, 255', () => {
    const result = getDarkModeClass("rgb(255, 255, 255");
    expect(result).toBe("black");
  });

  it('returns "black" if color rgb is 252, 250, 249', () => {
    const result = getDarkModeClass("rgb(252, 250, 250");
    expect(result).toBe("black");
  });

  it('returns "dark-grey" if rgb is 226, 226, 226', () => {
    const result = getDarkModeClass("rgb(226, 226, 226");
    expect(result).toBe("dark-grey");
  });

  it('returns "dark-grey" if rgb is 250, 200, 228', () => {
    const result = getDarkModeClass("rgb(250, 200, 228");
    expect(result).toBe("dark-grey");
  });

  it('returns "mid-grey" if rgb is 201, 201, 201', () => {
    const result = getDarkModeClass("rgb(201, 201, 201");
    expect(result).toBe("mid-grey");
  });

  it('returns "mid-grey" if rgb is 225, 250, 202', () => {
    const result = getDarkModeClass("rgb(225, 175, 202");
    expect(result).toBe("mid-grey");
  });

  it('returns "light-grey" if rgb is 200, 200, 200', () => {
    const result = getDarkModeClass("rgb(200, 200, 200");
    expect(result).toBe("light-grey");
  });

  it('returns "light-grey" if rgba is 0, 0, 0, 0.24', () => {
    const result = getDarkModeClass("rgba(0, 0, 0, 0.24");
    expect(result).toBe("light-grey");
  });

  it('returns "mid-grey" if rgba is 0, 0, 0, 0.18', () => {
    const result = getDarkModeClass("rgba(0, 0, 0, 0.18");
    expect(result).toBe("mid-grey");
  });

  it('returns "dark-grey" if rgba is 0, 0, 0, 0.02', () => {
    const result = getDarkModeClass("rgba(0, 0, 0, 0.02");
    expect(result).toBe("dark-grey");
  });

  it('returns "colored" if rgb is 0, 81, 162', () => {
    const result = getDarkModeClass("rgba(0, 81, 162)");
    expect(result).toBe("colored");
  });

  it('does not return "colored" if rgb is 0, 81, 160', () => {
    const result = getDarkModeClass("rgba(0, 79, 79)");
    expect(result).not.toBe("colored");
    expect(result).toBe("light-grey");
  });
});
