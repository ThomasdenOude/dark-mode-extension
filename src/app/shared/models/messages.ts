import { Mode } from "./mode";

export type RequestModeMessage = {
  requestMode: boolean;
};

export type ChangeModeMessage = {
  changeMode: Mode;
};

export function isChangeModeMessage(
  messageType: RequestModeMessage | ChangeModeMessage,
): messageType is ChangeModeMessage {
  return "changeMode" in messageType;
}

export type CurrentModeResponse = {
  currentMode: Mode;
};
