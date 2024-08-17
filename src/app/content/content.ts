import { CLASS_PREFIX } from "./constants/class-prefix";
import { MUTATION_CONFIG } from "./constants/mutation-config";
import {
  setDarkMode,
  setDarkModeForNewElements,
} from "./add-dark-mode/add-dark-mode";

const body: HTMLBodyElement | null = document.querySelector("body");

const observer: MutationObserver = new MutationObserver(
  setDarkModeForNewElements,
);

chrome.runtime.onMessage.addListener((message) => {
  const activeClass = CLASS_PREFIX + "-active";
  if (
    message.mode === "dark" &&
    body &&
    !body.classList.contains(activeClass)
  ) {
    setDarkMode(body);
    body.classList.add(activeClass);
    observer.observe(body, MUTATION_CONFIG);
  }
  if (
    message.mode === "light" &&
    body &&
    body.classList.contains(activeClass)
  ) {
    body.classList.remove(activeClass);
    observer.disconnect();
  }
});
