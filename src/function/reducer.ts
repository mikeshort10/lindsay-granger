import {
  Player,
  Houses,
  State,
  OccupantType,
  ItemType,
  TimerType,
} from "../types";
import { getEnemyNumberAndType, keyup, M } from ".";
import {
  DOOR_SPACE,
  randomPlayableSpace,
  isInEnemyLair,
  BOOK_SPACE,
} from "./board";
import { pipe } from "fp-ts/lib/pipeable";
import { flow, not } from "fp-ts/lib/function";
import { eqNumber } from "fp-ts/lib/Eq";
import { generateBoss, bossAction } from "./boss";
import { getEnemies, moveEnemy } from "./enemy";
import { playerAction } from "./player";

const setItemOnRandomPlace = (item: OccupantType, state: State): State => {
  const items = new Map(state.items).set(
    randomPlayableSpace(item, state, not(isInEnemyLair)),
    item
  );
  return { ...state, items };
};

const multiRandomPlayableSpaces = (total: number, item: ItemType) => {
  return function $recPlace(state: State, toGo = total): State {
    if (toGo < 1) {
      return state;
    }
    return $recPlace(setItemOnRandomPlace(item, state), toGo - 1);
  };
};

const modifyItems = (key: number, value: OccupantType) => {
  return ({ items, ...state }: State): State =>
    pipe(items, M.insertAt(eqNumber)(key, value), (items) => ({
      ...state,
      items,
    }));
};

const setupItems = flow(
  modifyItems(BOOK_SPACE, "book"),
  modifyItems(DOOR_SPACE, "door"),
  multiRandomPlayableSpaces(12, "wand"),
  multiRandomPlayableSpaces(6, "potion")
);

export const initialState = (level: Houses): State => {
  const { enemyNum, enemyType } = getEnemyNumberAndType(level);
  const staticState: State = {
    boss: generateBoss(enemyNum),
    modal: 0,
    player: new Player(),
    playerDirection: undefined,
    enemies: [],
    cloak: false,
    light: undefined,
    attacking: true,
    items: new Map(),
    enemyMove: 0,
  };
  return pipe(
    staticState,
    getEnemies(enemyType),
    setupItems,
    ({ items, ...state }): State => ({
      items: items.set(DOOR_SPACE, undefined),
      ...state,
    })
  );
};

type ActionType = string | "movePlayer" | "keyup" | "toggleLight";

type Payload = { [key: string]: any };

type Action = { type: ActionType; payload?: Payload };

type ActionHandler = (state: State, payload?: Payload) => State;

const handlers: Record<ActionType, ActionHandler> = {
  toggleLight: (state) =>
    state.light != null ? { ...state, light: !state.light } : state,
  movePlayer: (state, payload) => playerAction(state, payload?.keyCode),
  moveBoss: bossAction,
  // acquireCloak: state => ({ ...state, hasClock: true })
  keyup: (state, payload) => keyup(state, payload?.keyCode),
  moveEnemies: (state, payload: { timer?: TimerType } | undefined) =>
    payload?.timer ? moveEnemy(state, payload.timer) : state,
};

export const reducer = (state: State, { type, payload = {} }: Action) => {
  const handler = handlers[type];
  return handler ? handler(state, payload) : state;
};
