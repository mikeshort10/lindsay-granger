import {
  BOSS_START,
  randomInt,
  indexFromCoords,
  alterState,
  isInEnemyLair,
  isPlayableBy,
  getPositions,
  takeDamageFrom,
} from ".";
import { State, Wizard, OccupantType } from "../types";
import { flow } from "fp-ts/lib/function";

export const generateBoss = (enemies: number): Wizard => ({
  HP: 9 * enemies,
  randomLimit: 4,
  baseAttack: enemies,
  position: BOSS_START,
});

const randomSpaceInLair = () =>
  indexFromCoords([randomInt(17, 24)(), randomInt(46, 51)()]);

const spaceIsPlayableBy = (o: OccupantType, state: State, space: number) =>
  isPlayableBy(o)(getPositions(state).get(space));

const moveBoss = (state: State): State => {
  const position = randomSpaceInLair();
  if (isInEnemyLair(position) && spaceIsPlayableBy("boss", state, position)) {
    return { ...state, boss: { ...state.boss, position } };
  }
  return moveBoss(state);
};

const bossAttacksPlayer = (state: State) =>
  alterState("player", takeDamageFrom(state.boss))(state);

export const bossAction = flow(moveBoss, bossAttacksPlayer);
