import { Space, OccupantType, Coords, EnemyType, State } from "../types";
import {
  equalOrdArray,
  A,
  randomInt,
  getPositions,
  lessThanOrEqualArray,
  greatThanOrEqualArray,
} from ".";
import { pipe } from "fp-ts/lib/pipeable";
import { Predicate, flow } from "fp-ts/lib/function";
import { obstacles } from "../JSON/obstacles";
import { Ord, leq, lt } from "fp-ts/lib/Ord";
import { Ordering } from "fp-ts/lib/Ordering";
import { makeBy } from "fp-ts/lib/Array";

export const BOARD_SIDE_LENGTH = 54;

enum OccupantEnum {
  wall = 3,
  boss = 2,
  player = 2,
  book = 2,
  door = 2,
  enemy = 1,
  slytherin = 1,
  ravenclaw = 1,
  hufflepuff = 1,
  item = 0,
  potion = 0,
  wand = 0,
}

export const getSurroundingFromIndex = (index: number) => {
  return pipe(
    A.array.ap(
      [
        (x) => x + 1,
        (x) => x - 1,
        (x) => x - BOARD_SIDE_LENGTH,
        (x) => x + BOARD_SIDE_LENGTH,
      ],
      [index]
    ),
    A.filter((x: number) => isMoveable(index, x))
  );
};

export const getSurroundingSpaces = (pos: number) => [
  pos - 1,
  pos - BOARD_SIDE_LENGTH,
  pos + 1,
  pos + BOARD_SIDE_LENGTH,
];

export const moveSwitch = (code: number | undefined) => {
  return (pos: number): number => {
    const adjacentSpaces = getSurroundingSpaces(pos);
    return code ? adjacentSpaces[code - 37] : pos;
  };
};

export const ordOccupant: Ord<OccupantType | "enemy" | "item"> = {
  equals: (a, b) => {
    if (a === b) {
      return true;
    } else if (a == null || b == null) {
      return false;
    }
    return OccupantEnum[a] === OccupantEnum[b];
  },
  compare: (a, b) => {
    const getEnumOrZero = (a: OccupantType | "enemy" | "item") =>
      a ? OccupantEnum[a] : -1;
    const difference = getEnumOrZero(a) - getEnumOrZero(b);
    return difference ? ((difference / Math.abs(difference)) as Ordering) : 0;
  },
};

console.assert(ordOccupant.equals("boss", "boss"));
console.assert(ordOccupant.equals("boss", "wand") === false);
console.assert(ordOccupant.equals("boss", "player"));
console.assert(ordOccupant.compare("boss", "boss") === 0);
console.assert(ordOccupant.compare("boss", "wand") === 1);
console.assert(ordOccupant.compare("slytherin", "boss") === -1);
console.assert(ordOccupant.compare("slytherin", "hufflepuff") === 0);
console.assert(leq(ordOccupant)("boss", "player"));
console.assert(leq(ordOccupant)("wand", "player"));

export const indexFromCoords = ([row, col]: Coords) =>
  row * BOARD_SIDE_LENGTH + col;

const indexAsCoords = (i: number): Coords => [
  Math.floor(i / BOARD_SIDE_LENGTH),
  i % BOARD_SIDE_LENGTH,
];

// todo: enemy should stay within (larger) lighted area
// todo: maybe timeout after you find enemy?

export const BOSS_START = indexFromCoords([23, 48]);
export const DOOR_SPACE = indexFromCoords([23, 46]);
export const BOOK_SPACE = indexFromCoords([36, 48]);
export const PLAYER_START = indexFromCoords([28, 28]);

const withinArrays = (low: Coords, high: Coords) => {
  return (arr2: Coords) => {
    return lessThanOrEqualArray(high)(arr2) && greatThanOrEqualArray(low)(arr2);
  };
};

export const isInEnemyLair = (position: number) => {
  const coords = indexAsCoords(position);
  return (
    withinArrays([18, 47], [24, 51])(coords) ||
    withinArrays([17, 48], [17, 49])(coords) ||
    withinArrays([19, 46], [20, 46])(coords)
  );
};

const isInCenter = flow(indexAsCoords, withinArrays([23, 23], [32, 32]));

// const isOverwriteable = (b: OccupantType) => (a: OccupantType) =>
//   gt(ordOccupant)(a, b);

export const walls = pipe(
  A.array.reduceWithIndex(obstacles, [] as number[], (r, acc, row) => {
    return [...acc, ...row.map((c) => indexFromCoords([r, c]))];
  }),
  (a) => new Set(a)
);

const isMoveable = (lastIndex: number, nextIndex: number) => {
  const differenceInSpace = Math.abs(
    (lastIndex % BOARD_SIDE_LENGTH) - (nextIndex % BOARD_SIDE_LENGTH)
  );
  return differenceInSpace === 0 || differenceInSpace === 1;
};

export const isPlayableBy = (player: OccupantType) => (space: OccupantType) => {
  return lt(ordOccupant)(space, player);
};

export const randomPlayableSpace = (
  occupant: OccupantType,
  state: State,
  ...p: Predicate<number>[]
): number => {
  const positions = getPositions(state);
  const pos = randomInt(0, BOARD_SIDE_LENGTH ** 2 - 1)();
  const playable =
    isPlayableBy(occupant)(positions.get(pos) || state.items.get(pos)) &&
    !walls.has(pos) &&
    !isInCenter(pos);
  const otherConditions = A.array.reduce(p, true, (acc, fn) => acc && fn(pos));
  return playable && otherConditions
    ? pos
    : randomPlayableSpace(occupant, state, ...p);
};

const diffOfSpacesAsCoords = (originalPos: number, newPos: number): Coords => {
  const [x1, y1] = indexAsCoords(originalPos);
  const [x2, y2] = indexAsCoords(newPos);
  return [Math.abs(x2 - x1), Math.abs(y2 - y1)];
};

const isDarknessCorner = (center: number, point: number) =>
  pipe(diffOfSpacesAsCoords(center, point), equalOrdArray([2, 2]));

const withinSquareRadius = (r: number, arr: Coords) =>
  withinArrays([-r, -r], [r, r])(arr);

// const memoize = (fn: Function) => {
//   const cache: Record<string, any> = {};
//   return function(...args: any[]) {
//     const key = JSON.stringify(args);
//     if (!cache[key]) {
//       cache[key] = fn.call(null, ...args);
//     }
//     return cache[key];
//   };
// };

export const litSpaces = ({ light, player: { position } }: State) => {
  const dark = light ? 3 : 2;
  const originalPos = position;
  const alreadyEvaluated: Record<number, boolean> = {};
  return (function $litSpaces(
    nextPos: number = position,
    litSpaces: Set<number> = new Set()
  ): Set<number> {
    const fromOrigPos = diffOfSpacesAsCoords(originalPos, nextPos);
    if (!withinSquareRadius(dark, fromOrigPos) || alreadyEvaluated[nextPos]) {
      return litSpaces;
    }
    alreadyEvaluated[nextPos] = true;
    return pipe(
      !withinSquareRadius(dark - 1, fromOrigPos) ||
        isDarknessCorner(originalPos, nextPos),
      (darkness) => (darkness ? litSpaces : litSpaces.add(nextPos)),
      (b) =>
        A.array.reduce(getSurroundingFromIndex(nextPos), b, (acc, nextIndex) =>
          $litSpaces(nextIndex, acc)
        )
    );
  })();
};

const modifyPlayer = <T>(bool: boolean, player: OccupantType) => {
  return (t: T): T => (bool === false ? t : { ...t, player });
};

export const makeSpaces = (state: State) => {
  const { enemies, player, boss, items } = state;
  const enemyPositions = A.array.reduce(
    [...enemies],
    {} as Record<number, EnemyType>,
    (acc, { position, player }) => ({ ...acc, [position]: player })
  );

  const isLit = litSpaces(state);

  return pipe(
    makeBy(BOARD_SIDE_LENGTH ** 2, (i) =>
      pipe(
        ((): Space => ({ darkness: !isLit.has(i) }))(),
        modifyPlayer(walls.has(i), "wall"),
        modifyPlayer(items.get(i) != null, items.get(i)),
        modifyPlayer(i === player.position, "player"),
        modifyPlayer(i === boss.position, "boss"),
        modifyPlayer(enemyPositions[i] != null, enemyPositions[i])
      )
    )
  );
};
