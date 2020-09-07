import { Wizard, State, OccupantType, Enemy } from "../types";
import { atLeastZero, M, S, O } from "./index";
import { randomInt } from "fp-ts/lib/Random";
import { pipe } from "fp-ts/lib/pipeable";
import { not } from "fp-ts/lib/function";
import { isInEnemyLair, randomPlayableSpace, litSpaces } from "./board";
import { eqNumber } from "fp-ts/lib/Eq";
import { ordNumber } from "fp-ts/lib/Ord";

export const randomRespawn = (name: OccupantType) => (state: State): State => ({
  ...state,
  items: pipe(
    state.items,
    M.deleteAt(eqNumber)(state.player.position),
    M.insertAt(eqNumber)(
      randomPlayableSpace(name, state, not(isInEnemyLair)),
      name
    )
  ),
});

const getAttack = <W extends Wizard>({ randomLimit, baseAttack }: W) =>
  randomInt(baseAttack, randomLimit + baseAttack)();

export const takeDamageFrom = <P extends Wizard>(p: P) => {
  return <E extends Wizard>(e: E): E => {
    return { ...e, HP: e.HP - atLeastZero(getAttack(p)) };
  };
};

export const spaceIsLitOrNull = (state: State) => {
  return ({ position }: Enemy): boolean =>
    pipe(litSpaces(state), (s) => S.elem(ordNumber)(position, s));
};

export const setEnemyAttack = (enemy: Enemy) => ({ ...enemy, attack: true });

export const encounterPlayer = (state: State) => (enemy: Enemy): Enemy =>
  pipe(
    enemy,
    O.fromPredicate(spaceIsLitOrNull(state)),
    O.map(setEnemyAttack),
    O.getOrElse(() => enemy)
  );

// todo: add damage boss
// todo: fix door coloring after entering
// todo: fix enemies stop moving

// const getNextSteps = (state: State, enemyType: EnemyType) => {
//   return (position: number, currentRoute: number[]) => {
//     return pipe(
//       getSurroundingFromIndex(position),
//       A.filter((newPos) =>
//         pipe(
//           getSpace(state, newPos),
//           foldPredicates([
//             (p) => isPlayableBy(enemyType)(p) || p === "player",
//             () => walls.has(position) === false,
//           ])
//         )
//       ),
//       A.map((step) => [...currentRoute, step])
//     );
//   };
// };

// const __recFindPath = (enemy: Enemy, state: State) => {
//   const calcNextSteps = getNextSteps(state, enemy.player);
//   return (function $recFindPath([currRoute, ...queue], map): number[] {
//     return pipe(
//       currRoute,
//       O.fromPredicate(isNonEmptyArray),
//       O.map(NEA.last),
//       O.map(n => {
//         if (n === state.player.position) {
//           console.log("found");
//           return currRoute;
//         } else if (map.has(n)) {
//           console.log("mapped");
//           return $recFindPath(queue, new Set(map));
//         }
//         console.log("next");
//         return $recFindPath(
//           [...queue, ...calcNextSteps(n, currRoute)],
//           new Set(map).add(n)
//         );
//       }),
//       O.getOrElse(constant<number[]>([]))
//     );
//   })(calcNextSteps(enemy.position, []), new Set<number>());
// };
