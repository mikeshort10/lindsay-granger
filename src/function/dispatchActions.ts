import { Dispatch } from "../types";
import { isValidCode, isMoveCode } from ".";
import { flow } from "fp-ts/lib/function";

const handleBluetooth = (e: KeyboardEvent): KeyboardEvent => {
  const index = ["Left", "Up", "Right", "Down"].indexOf(e.key);
  if (e.keyCode == null && index !== -1) {
    return { ...e, keyCode: index + 37 };
  }
  return e;
};

console.assert(
  handleBluetooth({ keyCode: 37, key: "Left" } as KeyboardEvent).keyCode === 37,
  "keyCode is not maintained on handleBluetooth"
);

console.assert(
  handleBluetooth({ key: "Left" } as KeyboardEvent).keyCode === 37,
  "keyCode is not updated correctly on handleBluetooth"
);

console.assert(
  handleBluetooth({} as KeyboardEvent).keyCode === undefined,
  "keyCode what updated on empty event"
);

console.assert(false, "this should be false");

const handleIPad = (e: KeyboardEvent): KeyboardEvent => {
  const directions = ["Left", "Up", "Right", "Down"];
  const match = e.key?.match?.(/UIKeyInput(.+)Arrow/);
  if (match == null) {
    return e;
  }
  const direction = match[1];
  const keyCode = directions.indexOf(direction) + 37;
  if (isValidCode(keyCode) && isMoveCode(keyCode)) {
    return { ...e, keyCode };
  }
  return e;
};

console.assert(
  handleIPad({ key: "UIKeyInputUpArrow" } as KeyboardEvent).keyCode === 38,
  `${handleIPad({ key: "UIKeyInputUpArrow" } as KeyboardEvent)}`
);

const __keydown = (dispatch: Dispatch) => ({ keyCode }: KeyboardEvent) => {
  keyCode === 32 && dispatch({ type: "toggleLight" });
  isValidCode(keyCode) &&
    dispatch({ type: "toggleLight", payload: { keyCode } });
};

export const keydown = (dispatch: Dispatch) =>
  flow(handleBluetooth, handleIPad, __keydown(dispatch));

const __handleKeys = (dispatch: Dispatch) => {
  return ({ keyCode, type }: KeyboardEvent) =>
    dispatch({ type, payload: { keyCode } });
};

export const handleKeys = (dispatch: Dispatch) =>
  flow(handleBluetooth, handleIPad, __handleKeys(dispatch));

const __movePlayer = (dispatch: Dispatch) => {
  return ({ keyCode, key }: KeyboardEvent) =>
    dispatch({ type: "movePlayer", payload: { keyCode, key } });
};

export const movePlayer = (dispatch: Dispatch) =>
  flow(handleBluetooth, handleIPad, __movePlayer(dispatch));
