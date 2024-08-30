import {
  darkModeClassesObserver,
  initModePreference,
} from "./add-dark-mode/add-dark-mode";

const body: HTMLBodyElement | null = document.querySelector("body");
const html: HTMLHtmlElement | null = document.querySelector("html");
const observer: MutationObserver = new MutationObserver(
  darkModeClassesObserver,
);

if (body && html) {
  initModePreference(body, html, observer);
}
