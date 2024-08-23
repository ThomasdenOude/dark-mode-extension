import { ModeInfo } from "../models/mode";
import { DarkIcons, LightIcons } from "./mode-icons";
import { Mode } from "../../shared/models/mode";

export const DarkMode: Readonly<ModeInfo> = {
  mode: Mode.Dark,
  title: "Switch to light mode",
  icons: DarkIcons,
};
export const LightMode: Readonly<ModeInfo> = {
  mode: Mode.Light,
  title: "Switch to dark mode",
  icons: LightIcons,
};
