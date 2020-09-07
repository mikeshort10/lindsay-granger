import { ValidCode, Level, Houses, OccupantType, State } from "../types";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import * as R from "fp-ts/lib/Record";
import * as S from "fp-ts/lib/Set";
import * as M from "fp-ts/lib/Map";
import * as NEA from "fp-ts/lib/NonEmptyArray";
import { isBetween, isMoveCode, curry2 } from "./utils";
import { randomInt } from "fp-ts/lib/Random";
import { ordNumber } from "fp-ts/lib/Ord";
import { tuple } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";

export * from "./board";
export * from "./utils";
export * from "./wizards";
export { A, O, R, M, S, NEA, randomInt };

// As I level up, my attack changes
// directions for cloak
// directions for lumos
// directions for book
// I can move on to level 2 😱

export const isValidCode = (code: number | undefined): code is ValidCode =>
  code != null &&
  (isBetween(37, 40)(code) || code === 65) &&
  Number.isInteger(code);

export const keyup = (state: State, keyCode: number | undefined): State => {
  if (!isValidCode(keyCode)) {
    return state;
  } else if (isMoveCode(keyCode)) {
    return { ...state, playerDirection: undefined };
  }
  return { ...state, attacking: false };
};

export const getEnemyNumberAndType = (enemyType: Houses) => {
  return { enemyType, enemyNum: Level[enemyType] * 6 };
};

export const getPositions = ({
  boss,
  player,
  items,
  enemies,
}: State): Map<number, OccupantType> => {
  return new Map([
    [boss.position, "boss"],
    [player.position, "player"],
    ...M.toArray(ordNumber)(items),
    ...A.array.map([...enemies], ({ position, player }) =>
      tuple(position, player)
    ),
  ]);
};

export const getSpace = (state: State, pos: number) =>
  getPositions(state).get(pos);

export const cGetSpace = curry2(getSpace);

export const alterState = <K extends keyof State>(
  key: K,
  fn: (v: State[K]) => State[K]
) => (state: State): State =>
  pipe(state[key], fn, (v) => ({ ...state, [key]: v }));
