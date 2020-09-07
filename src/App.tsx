import React, { useEffect, useReducer } from "react";
import { Status, Houses, RH, State, TimerType } from "./types";
import { A, makeSpaces, DOOR_SPACE, isInEnemyLair } from "./function";
import { pipe } from "fp-ts/lib/pipeable";
import { Space } from "./components/Space";
import { reducer, initialState } from "./function/reducer";
import { ProgressBar } from "./components/ProgressBar";
import { handleKeys, keydown, movePlayer } from "./function/dispatchActions";
import { XPToLevelUP } from "./function/player";

type GrangerProps = { level: Houses; status: Status; setStatus: RH<Status> };

const timer: TimerType = { round: 0 };

const getBossSpeedByLevel = (level: Houses) => {
  const bossSpeedsByLevel: Record<Houses, number> = {
    hufflepuff: 10000,
    ravenclaw: 7500,
    slytherin: 5000,
  };
  return bossSpeedsByLevel[level];
};

const hasEnteredLair = ({ items, player }: State) => {
  return items.has(DOOR_SPACE) && isInEnemyLair(player.position);
};

const Granger: React.FC<GrangerProps> = ({ level, setStatus, status }) => {
  const [state, dispatch] = useReducer(reducer, initialState(level));
  const { player, boss } = state;

  // EVENTS

  useEffect(() => {
    document.addEventListener("keyup", handleKeys(dispatch));
    document.addEventListener("keypress", keydown(dispatch));
    document.addEventListener("keydown", movePlayer(dispatch));
    timer.id = window.setInterval(() => {
      timer.round += 1;
      return dispatch({
        type: "moveEnemies",
        payload: { timer },
      });
    }, 500);
    return () => {
      document.removeEventListener("keypress", keydown(dispatch));
      document.removeEventListener("keyup", handleKeys(dispatch));
      document.removeEventListener("keydown", movePlayer(dispatch));
      window.clearInterval(timer.id);
    };
  }, []);

  const inLair = hasEnteredLair(state);

  useEffect(() => {
    if (inLair) {
      window.clearInterval(timer.id);

      timer.id = window.setInterval(
        () => dispatch({ type: "moveBoss" }),
        getBossSpeedByLevel(level)
      );
      return () => window.clearInterval(timer.id);
    }
  }, [inLair, level]);

  // handle end of game
  useEffect(() => {
    if (status === "play" && (player.HP < 1 || boss.HP < 1)) {
      window.clearInterval(timer.id);
      setStatus(player.HP < 1 ? "...lose" : "win!");
    }
  }, [player.HP, boss.HP, status, setStatus]);

  const spaces = pipe(
    makeSpaces(state),
    A.mapWithIndex((key, space) => (
      <Space key={key} space={space} light={state.light} cloak={state.cloak} />
    ))
  );

  return (
    <div id="game" className="flex flex-col items-center w-full">
      <div className="text-sm px-5 py-5 w-full">
        <div>Level: {player.level}</div>
        <ProgressBar
          label="HP"
          color="green"
          value={player.HP}
          total={player.maxHP}
        />
        <ProgressBar
          label="XP"
          color="blue"
          value={player.XP}
          total={XPToLevelUP(player)}
        />
        {/* <div className="h-10">{<i className="book fas fa-book" />}</div> */}
      </div>
      <div id="granger-board">{spaces}</div>
    </div>
  );
};

export default Granger;
