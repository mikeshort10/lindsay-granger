import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Status, Houses } from "./types";
import { GameStart } from "./components/GameStart";
import { Story } from "./components/Story";

const Game: React.FC = () => {
  const [gameStatus, setGameStatus] = React.useState<Status>("story");
  const [level, setLevel] = React.useState<Houses>("hufflepuff");
  if (gameStatus === "story") {
    return <Story setStatus={setGameStatus} />;
  } else if (gameStatus === "win!") {
    return <p>You win!</p>;
  } else if (gameStatus === "...lose") {
    return <p>You lost...</p>;
  } else if (gameStatus === "setup") {
    const beginGame = (level: Houses) => () => {
      setLevel(level);
      setGameStatus("play");
    };
    return <GameStart beginGame={beginGame} house={level} />;
  }
  return <App status={gameStatus} level={level} setStatus={setGameStatus} />;
};

const LindsayGranger: React.FC = () => {
  return (
    <div className="w-screen flex flex-col items-center">
      <Game />
    </div>
  );
};

ReactDOM.render(<LindsayGranger />, document.querySelector("#root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
