import { Icons } from "./icons";

export type Mode = "light" | "dark";

export type ModeInfo = {
  mode: Mode;
  title: string;
  icons: Icons;
};
export type ModePreferences = {
  [key: string]: Mode;
};
