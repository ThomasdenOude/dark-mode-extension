import { Mode } from "../../shared/models/mode";
import { CLASS_PREFIX } from "../../shared/constants/class-prefix";

const preferenceKey = CLASS_PREFIX + "-preference";

export function getPreference(): Mode {
  const preference = localStorage.getItem(preferenceKey);

  return preference === Mode.Dark ? Mode.Dark : Mode.Light;
}

export function setPreference(mode: Mode): void {
  localStorage.setItem(preferenceKey, mode);
}
