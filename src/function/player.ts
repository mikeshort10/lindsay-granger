import {
  State,
  OccupantType,
  Player,
  EnemyType,
  ValidCode,
  Enemy,
  MoveCode,
  Wizard,
} from "../types";
import { pipe } from "fp-ts/lib/pipeable";
import { tupled, tuple, flow } from "fp-ts/lib/function";
import {
  O,
  A,
  M,
  BOOK_SPACE,
  DOOR_SPACE,
  getPositions,
  getSpace,
  isMoveCode,
  ordOccupant,
  moveSwitch,
  alterState,
  isPlayableBy,
  takeDamageFrom,
  isInEnemyLair,
  chainFromPredicate,
  isValidCode,
  walls,
  encounterPlayer,
  randomRespawn,
  trace,
} from ".";
import { generateVillain } from "./enemy";
import { eqNumber } from "fp-ts/lib/Eq";
import { ordNumber, ordString } from "fp-ts/lib/Ord";
import { fold } from "fp-ts/lib/boolean";
import { isSome } from "fp-ts/lib/Option";
import { spaceIsLitOrNull, setEnemyAttack } from "./wizards";

const addXPFromEnemy = (i: number) => {
  return (state: State): State => {
    const XPMap: Record<EnemyType, number> = {
      hufflepuff: 15,
      ravenclaw: 20,
      slytherin: 35,
      boss: 100,
    };
    const { player: house } = state.enemies[i];
    return xpUp(XPMap[house])(state);
  };
};

const isEnemyDead = (i: number) => (s: State) => s.enemies[i].HP <= 0;

const getReincarnatedHouse = ({ player }: Enemy) =>
  player === "hufflepuff" ? "ravenclaw" : "slytherin";

const respawn = tupled((state: State, index: number): [State, number] =>
  pipe(
    [...state.enemies],
    O.fromPredicate((es) => isEnemyDead(index)(state)),
    O.chain(
      A.modifyAt(index, (e: Enemy) =>
        generateVillain(state, getReincarnatedHouse(e))
      )
    ),
    O.getOrElse(() => state.enemies),
    (enemies) => ({ ...state, enemies }),
    (s) => tuple(s, index)
  )
);

const gainExperience = tupled((state: State, index: number): [State, number] =>
  pipe(
    state,
    O.fromPredicate(isEnemyDead(index)),
    O.map(addXPFromEnemy(index)),
    O.getOrElse(() => state),
    (s) => tuple(s, index)
  )
);

const attackBoss = (state: State) =>
  pipe(
    state,
    O.fromPredicate((state) => isAtPlayerNextPosition(state)(state.boss)),
    O.map(
      (s): State =>
        pipe(s.boss, takeDamageFrom(state.player), (boss) => ({ ...s, boss }))
    )
  );

const damageEnemy = tupled((state: State, index: number): [State, number] =>
  pipe(
    [...state.enemies],
    A.modifyAt(
      index,
      flow(encounterPlayer(state), takeDamageFrom(state.player))
    ),
    O.map((enemies): State => ({ ...state, enemies })),
    (o) => (isSome(o) ? o : attackBoss(state)),
    O.getOrElse(() => state),
    (s) => tuple(s, index)
  )
);

const hpUp = (plusHP: number) => ({ player: p, ...state }: State): State => {
  return { ...state, player: { ...p, HP: Math.min(p.HP + plusHP, p.maxHP) } };
};

const xpUp = (plusXP: number) => ({ player: p, ...state }: State): State => {
  return { ...state, player: { ...p, XP: p.XP + plusXP } };
};

export const XPToLevelUP = ({ level }: Player) => (level + 1) * 10;

const levelUp = (state: State): State => {
  const player = { ...state.player };
  const toLevelUp = XPToLevelUP(player);

  if (toLevelUp > player.XP) {
    return state;
  }

  return levelUp({
    ...state,
    player: {
      ...player,
      XP: player.XP - toLevelUp,
      level: player.level + 1,
      maxHP: player.maxHP + 10,
      HP: player.HP + 10,
      baseAttack: player.baseAttack + 2,
    },
  });
};

const increaseXP = flow(xpUp(10), levelUp);

const resetWand = flow(randomRespawn("wand"), increaseXP);

const resetPotion = flow(randomRespawn("potion"), hpUp(30));

const ifItem = (
  name: NonNullable<OccupantType>,
  modify: (s: State) => State
) => {
  return (state: State) =>
    pipe(
      state,
      O.fromPredicate(
        flow(
          ({ player }) => M.lookup(ordNumber)(player.position, state.items),
          O.chain(O.fromNullable), // todo
          O.map((x) => ordString.equals(x, name)),
          O.getOrElse((): boolean => false)
        )
      ),
      O.map(modify),
      O.getOrElse(() => state)
    );
};

const deleteItemAt = M.deleteAt(eqNumber);

const removeBookAndOpenDoor = flow(
  deleteItemAt(BOOK_SPACE),
  deleteItemAt(DOOR_SPACE)
);

const alohomora = alterState("items", removeBookAndOpenDoor);

const openDoor = (s: State) => ({ ...s, doorIsOpen: true, modal: 3 });

const ifWand = ifItem("wand", resetWand);

const ifPotion = ifItem("potion", resetPotion);

const ifBook = ifItem("book", flow(openDoor, alohomora));

const handleAttackBaseEnemy = (state: State) => (i: number) =>
  pipe(tuple(state, i), damageEnemy, gainExperience, respawn, ([s]) => s);

const atPosition = (newPos: number) => ({ position }: Wizard) =>
  ordNumber.equals(position, newPos);

const isAtPlayerNextPosition = ({ playerDirection, player }: State) =>
  pipe(player.position, moveSwitch(playerDirection), atPosition);

const getAttackedIndex = (state: State) =>
  pipe([...state.enemies], A.findIndex(isAtPlayerNextPosition(state)));

const attackEnemy = (state: State): State =>
  pipe(
    getAttackedIndex(state),
    O.map(handleAttackBaseEnemy(state)),
    O.getOrElse(() => state)
  );

const ifEnterLair = (state: State): State =>
  state.items.get(DOOR_SPACE) == null && isInEnemyLair(state.player.position) // todo: needs testing
    ? { ...state, items: state.items.set(DOOR_SPACE, "door") }
    : state;

const gainAbilityAtLevel = (
  level: number,
  ability: keyof Pick<State, "cloak" | "light">,
  inactive: false | undefined
) => {
  return (s: State) => {
    return s.player.level === level && s[ability] === inactive
      ? { ...s, [ability]: true }
      : s;
  };
};

const updatedPlayerDirection = (state: State, code: ValidCode) => ({
  ...state,
  playerDirection: isMoveCode(code) ? code : state.playerDirection,
});

const overrideableByPlayer = (space: OccupantType) =>
  isPlayableBy("player")(space) || space === "player" || space === "book";

const spaceIsEnemy = (state: State, position: number) =>
  ordOccupant.equals(getSpace(state, position), "enemy");

const isPlayableByPlayer = (state: State) => {
  const { position } = state.player;
  const space = getPositions(state).get(position);
  return (
    overrideableByPlayer(space) &&
    !walls.has(position) &&
    state.boss.position !== position &&
    !spaceIsEnemy(state, position)
  );
};

const movePlayer = (state: State) => (playerDirection: MoveCode) => {
  const position = moveSwitch(playerDirection)(state.player.position);
  return { ...state, playerDirection, player: { ...state.player, position } };
};

const playerMove = (state: State, code: ValidCode): State =>
  pipe(
    code,
    O.fromPredicate(isMoveCode),
    O.map(movePlayer(state)),
    chainFromPredicate(isPlayableByPlayer),
    O.map(getItemOrAbility),
    O.getOrElse(() => updatedPlayerDirection(state, code))
  );

const getItemOrAbility = flow(
  ifWand,
  ifPotion,
  ifBook,
  ifEnterLair,
  gainAbilityAtLevel(3, "cloak", false),
  gainAbilityAtLevel(5, "light", undefined)
);

const activateNearbyEnemies = (state: State): State =>
  pipe(
    [...state.enemies],
    A.map((enemy) =>
      pipe(
        enemy,
        O.fromPredicate(spaceIsLitOrNull(state)),
        O.map(setEnemyAttack),
        O.getOrElse(() => enemy)
      )
    ),
    (enemies) => ({ ...state, enemies })
  );

export const playerAction = (state: State, keyCode: number | undefined) =>
  pipe(
    keyCode,
    O.fromPredicate(isValidCode),
    O.map((code) =>
      pipe(
        isMoveCode(code),
        fold(
          () => attackEnemy(state),
          () => playerMove(state, code)
        )
      )
    ),
    O.getOrElse(() => state),
    activateNearbyEnemies,
    trace(({ enemies }) => enemies.filter(({ attack }) => attack))
  );
