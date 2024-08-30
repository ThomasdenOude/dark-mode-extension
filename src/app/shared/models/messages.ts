import { Mode } from "./mode";

export type UpdateModeMessages = {
  requestMode?: boolean;
  updateMode?: boolean;
  changeMode?: Mode;
};

export type CurrentModeResponse = {
  currentMode: Mode;
};
