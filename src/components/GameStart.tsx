import React, { useState } from "react";
import { Button } from "./Button";
import { Houses } from "../types";
import * as A from "fp-ts/lib/Array";
import { SettingCard, Paragraph } from "./StaticComponents";

type OptionProps = {
  value: Houses;
  label: string;
  selected: boolean;
  handleClick: (value: Houses) => (e: React.MouseEvent<HTMLDivElement>) => void;
};

const Option: React.FC<OptionProps> = ({
  label,
  handleClick,
  value,
  selected,
  ...rest
}) => {
  const onClick = handleClick(value);
  return (
    <div className="w-full flex items-center px-3" onClick={onClick} {...rest}>
      {selected && <i className="fas fa-arrow-right" />}
      <span>{label}</span>
    </div>
  );
};

type SelectProps = {
  optionProps: Omit<OptionProps, "handleClick" | "selected">[];
  handleClick: (level: Houses) => void;
  selectedValue: Houses;
  value: Houses;
};

const Select: React.FC<SelectProps> = ({
  optionProps,
  handleClick,
  value,
  selectedValue,
}) => {
  const [show, setShow] = useState(false);

  const onOptionClick = (level: Houses) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      handleClick(level);
      setShow(false);
    };
  };

  const options = A.array.mapWithIndex(optionProps, (key, props) => (
    <Option
      key={key}
      {...props}
      handleClick={onOptionClick}
      selected={props.value === selectedValue}
    />
  ));

  const currentSelected = optionProps.find((props) => props.value === value);
  return (
    <div
      onClick={() => setShow(true)}
      className="bg-white rounded text-gray-800 py-3 px-3"
    >
      {show ? (
        <div className={``}>{options}</div>
      ) : (
        <div className={`h-full flex justify-start pl-3 items-center`}>
          {currentSelected?.label}
        </div>
      )}
    </div>
  );
};

type GameStartProps = {
  house: Houses;
  beginGame: (level: Houses) => () => void;
};

export const GameStart: React.FC<GameStartProps> = ({ beginGame, house }) => {
  const [level, setLevel] = useState<Houses>(house);

  const startGame = beginGame(level);
  const handleOptionClick = (value: Houses) => setLevel(value);

  return (
    <SettingCard>
      <Paragraph>
        You are at the center of Hogwarts. Without the lights, the castle is a
        maze to a first-year. Setting his victims to curse even more students,
        the Death Eater <i className="fas fa-skull" /> has sealed himself in one
        of the classrooms. Find the counter-curse{" "}
        <i className="fas fa-book book" /> to defeat the Death Eater!
      </Paragraph>
      <Paragraph>
        You may have taken out one Hufflepuff second-year, but more talented
        students may have fallen under the Imperius Curse as well. Defeat your
        schoolmates <i className="fas fa-hat-wizard hufflepuff" />{" "}
        <i className="fas fa-hat-wizard ravenclaw" />{" "}
        <i className="fas fa-hat-wizard slytherin" /> and find scrolls{" "}
        <i className="fas fa-scroll" /> to increase your experience and skills.
        If you do suffer any damage, there may be a few potions{" "}
        <i className="fas fa-flask potion" /> around the castle that can help
        you.
      </Paragraph>
      <Paragraph>
        Use the arrow keys to move or use them with "A" to attack.
      </Paragraph>
      <Paragraph>Select your difficulty and begin. Good luck!</Paragraph>
      <Select
        value={level}
        selectedValue={level}
        optionProps={[
          { value: "hufflepuff", label: "Easy" },
          { value: "ravenclaw", label: "Medium" },
          { value: "slytherin", label: "Hard" },
        ]}
        handleClick={handleOptionClick}
      />
      <Button
        color="green-500"
        className="w-full mt-3"
        primary
        onClick={startGame}
      >
        Start
      </Button>
    </SettingCard>
  );
};
