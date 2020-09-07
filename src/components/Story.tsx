import React from "react";
import { SettingCard, Paragraph } from "./StaticComponents";
import { Button } from "./Button";
import { Status } from "../types";

export const Story: React.FC<{ setStatus: (status: Status) => void }> = ({
  setStatus,
}) => {
  return (
    <SettingCard>
      <h1 className="text-center text-4xl py-4">
        Lindsay Granger
        <br />
        and the Imperius Curse
      </h1>
      <Paragraph>
        It has been over half a century since the Dark Lord's defeat. The Battle
        of Hogwarts left the castle significantly damaged, though not
        irreparably. Slowly, it recovered and even surpassed its former prestige
        and glory through successive headmasters and headmistresses, most
        notably by the greatest, Hermione Granger.
      </Paragraph>
      <Paragraph>
        Now, her granddaughter Lindsay is starting her first year at the
        wizarding school. Though she is new to the castle, she is by no means
        new to magic. Inheriting her grandmother's insatiable desire to learn,
        she has read about magic almost continuously since she was young. And
        when she couldn't read, she would listen to Muggle "audiobooks," a
        non-magic tech that her great-grandfather had left her.
      </Paragraph>
      <Paragraph>
        Although she has her first classes tomorrow, she cannot sleep. Today has
        been too exciting, walking through the halls of her grandmother's school
        and wearing the Gryffindor robes that she wore all those years ago.
        Having a touch of the infamous Weasley mischievousness, she sneaks out
        of the dorm on her first night to explore.
      </Paragraph>
      <Paragraph>
        After making it to the Great Hall, suddenly the lights goes out
        throughout the castle and Lindsay finds herself in total darkness. There
        are screams and cries down the hall, and without even thinking, Lindsay
        rushes to help. Finding a pudgy Hufflepuff stumbling in the hall, she
        asks if he is alright. But the look in his eyes reveals the truth.
        Lindsay has read about it time and again in her books: the Imperious
        Curse! It seems one of the followers of Voldermort's thinking have found
        their way into the castle!
      </Paragraph>
      <Paragraph>
        Quickly stunning the Hufflepuff boy, she remembers something her
        grandmother told her. The Defense Against the Dark Arts teacher had just
        developed a counter-curse for the Unforgiveable Curse. She sets out for
        his classroom, in hopes that something there might help her. Though she
        knows more about magic than anyone at the school, she is also
        inexperienced with it. She's not worried though.
      </Paragraph>
      <Paragraph>She is grandma's favourite after all...</Paragraph>
      <Button
        className="w-full"
        color="green-500"
        primary
        onClick={() => setStatus("setup")}
      >
        Next
      </Button>
    </SettingCard>
  );
};
