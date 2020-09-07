import React from "react";
import { Card, FormGroup, FormCheck, Button } from "react-bootstrap";

const CustomFormCheck = (changeState) => (name, propsValue) => ({ value }) => {
  return (
    <FormCheck
      type="radio"
      name={name}
      onChange={() => changeState(name, value)}
      checked={propsValue === value}
      value={value}
      label={value}
    />
  );
};

export const Settings = ({ changeState, enemyType, enemyNum }) => {
  const FormCheckWithProps = CustomFormCheck(changeState);
  const EnemyNumFormCheck = FormCheckWithProps("numOfEnemies", enemyNum);
  const EnemyTypeFormCheck = FormCheckWithProps("enemyType", enemyType);
  return (
    <Card
      style={{ color: "white", backgroundColor: "black" }}
      className="start-panel border-none"
    >
      <Card.Header
        style={{ color: "black", backgroundColor: "white" }}
        className="text-center header"
      >
        Select Your Difficulty
      </Card.Header>
      <Card.Header
        style={{ color: "black", backgroundColor: "white" }}
        className="header-placeholder"
      ></Card.Header>
      <Card.Body>
        How many students were cursed?
        <FormGroup>
          <EnemyNumFormCheck value={6} />
          <EnemyNumFormCheck value={12} />
          <EnemyNumFormCheck value={12} />
        </FormGroup>
        Which house were they from?
        <FormGroup>
          <EnemyTypeFormCheck value="hufflepuff" />
          <EnemyTypeFormCheck value="ravenclaw" />
          <EnemyTypeFormCheck value="slytherin" />
        </FormGroup>
      </Card.Body>
      <Button
        className="start-button"
        // onClick={() => changeStatus("play")}
        variant="success"
        vertical="true"
        block={true}
      >
        Play
      </Button>
    </Card>
  );
};
