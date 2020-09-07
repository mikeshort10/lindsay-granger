import { PLAYER_START } from "./function";

export type Status = "story" | "play" | "win!" | "...lose" | "setup";
export type Abilities = {
  cloak: boolean | undefined;
  light: boolean | undefined;
  doorIsOpen: boolean;
};
export type Houses = "hufflepuff" | "ravenclaw" | "slytherin";
export type EnemyType = Houses | "boss";
export type PlayerType = EnemyType | "player";
export type ItemType = "book" | "wand" | "potion" | "door";
export type OccupantType = PlayerType | ItemType | undefined | "wall";
export type Space = {
  darkness: boolean;
  player?: OccupantType;
};
export type MoveCode = 37 | 38 | 39 | 40;
export type ValidCode = MoveCode | 65;
export type Board = Space[];
export type Enemy = Wizard &
  Readonly<{
    attack: boolean;
    player: Houses;
    route?: number[];
  }>;

export type TimerType = {
  round: number;
  id?: number;
};

export type Coords = [number, number];

export type Enemies = ReadonlyArray<Enemy>;
export type Positioned = Readonly<{
  position: number;
}>;
export type Wizard = Positioned &
  Readonly<{
    HP: number;
    randomLimit: number;
    baseAttack: number;
  }>;

export class Player implements Wizard {
  HP = 30;
  player: OccupantType = "player";
  position = PLAYER_START;
  baseAttack = 6;
  randomLimit = 4;
  maxHP = 30;
  XP = 0;
  level = 1;
  attack = "Stupify";
}

export type RH<T> = React.Dispatch<React.SetStateAction<T>>;

export type Dispatch = ({
  type,
  payload,
}: {
  type: string;
  payload?: object;
}) => void;

export type Items = Map<number, OccupantType>;

export enum Level {
  "hufflepuff" = 1,
  "ravenclaw",
  "slytherin",
}

export type Positions = Map<number, OccupantType>;

export type State = Readonly<{
  boss: Wizard;
  modal: number;
  player: Player;
  enemies: Enemies;
  cloak: boolean;
  light: undefined | boolean;
  items: Map<number, OccupantType>;
  attacking: boolean;
  playerDirection: MoveCode | undefined;
  enemyMove: number;
}>;
