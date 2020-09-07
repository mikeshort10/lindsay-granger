import {
  A,
  O,
  atLeastZero,
  getSurroundingFromIndex,
  randomInt,
  walls,
  getSpace,
  foldPredicates,
  isPlayableBy,
  moveSwitch,
  chainFromPredicate,
  randomPlayableSpace,
  isInEnemyLair,
  isNonEmptyArray,
  getSurroundingSpaces,
  takeDamageFrom,
  encounterPlayer,
  cGetSpace,
} from ".";
import {
  Enemy,
  State,
  Houses,
  TimerType,
  Player,
  Wizard,
  EnemyType,
} from "../types";
import { flow, not } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";

const isPlayableByEnemy = (state: State) => ({ position, player }: Enemy) =>
  pipe(position, cGetSpace(state), isPlayableBy(player));

const getValidNextSteps = (
  position: number,
  state: State,
  enemyType: EnemyType
) =>
  getSurroundingFromIndex(position).filter((newPos) =>
    pipe(
      getSpace(state, newPos),
      foldPredicates([
        (p) => isPlayableBy(enemyType)(p) || p === "player",
        () => walls.has(position) === false,
      ])
    )
  );

const randomNewSpace = flow(randomInt(37, 40), moveSwitch);

const setEnemyPosition = (enemy: Enemy) => (position: number) => {
  return { ...enemy, position };
};

const setPosition = (state: State) => {
  return (enemy: Enemy): Enemy =>
    pipe(
      enemy.position,
      randomNewSpace(),
      O.fromPredicate(flow(cGetSpace(state), isPlayableBy(enemy.player))),
      O.map(setEnemyPosition(enemy)),
      O.getOrElse(() => enemy)
    );
};

const findPath = ({ position, player: enemyType }: Enemy, state: State) => {
  const mapped = new Set<number>();
  const squaresAround = getValidNextSteps(position, state, enemyType);
  const queue: number[][] = squaresAround.map((x) => [x]);
  while (queue.length) {
    const currentRoute = queue.shift() || [];
    const nextPos = currentRoute[currentRoute.length - 1];
    if (nextPos === state.player.position) {
      return currentRoute;
    } else if (mapped.has(nextPos)) {
      continue;
    }
    mapped.add(nextPos);
    const nextSteps = getValidNextSteps(nextPos, state, enemyType);
    nextSteps.forEach((pos) => {
      queue.push([...currentRoute, pos]);
    });
  }
  return [];
};

const getNewPath = (state: State) => (enemy: Enemy): Enemy =>
  pipe(
    findPath(enemy, state),
    O.fromPredicate(isNonEmptyArray),
    O.map(([position, ...route]) => ({ ...enemy, route, position })),
    O.getOrElse(() => enemy)
  );

const enemyMove = (state: State) => (e: Enemy) =>
  e.attack ? getNewPath(state)(e) : putzAround(state)(e);

const stopAtPlayer = (state: State, i: number) => (e: Enemy) =>
  e.position === state.player.position ? state.enemies[i] : e;

const areAdjacent = ({ position }: Enemy, { position: playerPos }: Player) => {
  return getSurroundingSpaces(position).includes(playerPos);
};

const damageAdjacentPlayer = (i: number) => ({ player, ...state }: State) => {
  const enemy = state.enemies[i];
  if (areAdjacent(enemy, player)) {
    return { player: takeDamageFrom(enemy)(player), ...state };
  }
  return { player, ...state };
};

const isHouseTurn = (timer: TimerType) => ({ player }: Enemy) => {
  enum HouseSpeed {
    slytherin = 1,
    ravenclaw,
    hufflepuff,
  }
  return timer.round % HouseSpeed[player] === 0;
};

const encounterItem = <A extends Wizard>(state: State) => {
  return ({ position }: A): boolean => state.items.has(position);
};

const atWall = <A extends Enemy | Player>({ position }: A) =>
  !walls.has(position);

const putzAround = (state: State) => (enemy: Enemy) =>
  pipe(
    enemy,
    setPosition(state),
    encounterPlayer(state),
    O.fromPredicate(not(encounterItem(state))),
    chainFromPredicate(atWall),
    chainFromPredicate(isPlayableByEnemy(state)),
    O.getOrElse(() => enemy)
  );

export const generateVillain = (state: State, player: Houses): Enemy => {
  const stats: Record<Houses, Pick<Enemy, "HP" | "baseAttack">> = {
    hufflepuff: { HP: 20, baseAttack: 6 },
    ravenclaw: { HP: 30, baseAttack: 10 },
    slytherin: { HP: 50, baseAttack: 15 },
  };
  return {
    ...stats[player],
    randomLimit: 4,
    position: randomPlayableSpace(player, state, not(isInEnemyLair)),
    attack: false,
    player,
  };
};

export const moveEnemy = (state: State, timer: TimerType, i = 0): State => {
  if (i >= state.enemies.length) {
    return { ...state, enemyMove: state.enemyMove + 1 };
  }
  return pipe(
    A.lookup(i, [...state.enemies]),
    chainFromPredicate(isHouseTurn(timer)),
    O.map(flow(enemyMove(state), stopAtPlayer(state, i))),
    O.chain((e) => A.modifyAt(i, (_: Enemy) => e)([...state.enemies])),
    O.getOrElse(() => state.enemies),
    (enemies) => ({ ...state, enemies }),
    damageAdjacentPlayer(i),
    (state) => moveEnemy(state, timer, i + 1)
  );
};

const makeMultipleEnemiesIf = (bool: boolean, house: Houses, state: State) =>
  A.makeBy(atLeastZero(bool ? 6 : 0), (_) => generateVillain(state, house));

// todo add recursive adding
export const getEnemies = (type: Houses) => (state: State): State => ({
  ...state,
  enemies: [
    ...makeMultipleEnemiesIf(type === "slytherin", "slytherin", state),
    ...makeMultipleEnemiesIf(type !== "hufflepuff", "ravenclaw", state),
    ...makeMultipleEnemiesIf(true, "hufflepuff", state),
  ],
});
