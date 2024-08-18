import { ModeInfo } from "../models/mode";
import { darkIcons, lightIcons } from "./mode-icons";

export const darkMode: Readonly<ModeInfo> = {
  mode: "dark",
  title: "Switch to light mode",
  icons: darkIcons,
};
export const lightMode: Readonly<ModeInfo> = {
  mode: "light",
  title: "Switch to dark mode",
  icons: lightIcons,
};
