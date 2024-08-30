import { Icons } from "./icons";
import { Mode } from "../../shared/models/mode";

export type ModeInfo = {
  mode: Mode;
  title: string;
  icons: Icons;
};
export type ModePreferences = {
  [key: string]: Mode;
};
