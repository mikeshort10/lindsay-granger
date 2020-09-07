import React from "react";
import { Card, Button } from "react-bootstrap";

export const Begin = function(props) {
	return (
		<div>
			<Card
				style={{ color: "white", backgroundColor: "black" }}
				className="text-center"
			>
				<Card.Header
					style={{ color: "black", backgroundColor: "white" }}
					className="header"
				>
					Lindsay Granger
					<br />
					and the Imperius Curse
				</Card.Header>
				<Card.Header
					style={{ color: "black", backgroundColor: "white" }}
					className="header-placeholder"
				>
					{" "}
					Lindsay Granger
					<br />
					and the Imperius Curse
				</Card.Header>
				<Card.Body>
					It has been over half a century since the Dark Lord's
					defeat. The Battle of Hogwarts left the castle significantly
					damaged, though not irreparably. Slowly, it recovered and
					even surpassed its former prestige and glory through
					successive headmasters and headmistresses, most notably by
					the greatest, Hermione Granger.
				</Card.Body>
				<Card.Body>
					Now, her granddaughter Lindsay is starting her first year at
					the wizarding school. Though she is new to the castle, she
					is by no means new to magic. Inheriting her grandmother's
					insatiable desire to learn, she has read about magic almost
					continuously since she was young. And when she couldn't
					read, she would listen to Muggle "audiobooks," a non-magic
					tech that her great-grandfather had left her.
				</Card.Body>
				<Card.Body>
					Although she has her first classes tomorrow, she cannot
					sleep. Today has been too exciting, walking through the
					halls of her grandmother's school and wearing the Gryffindor
					robes that she wore all those years ago. Having a touch of
					the infamous Weasley mischievousness, she sneaks out of the
					dorm on her first night to explore.
				</Card.Body>
				<Card.Body>
					After making it to the Great Hall, suddenly the lights goes
					out throughout the castle and Lindsay finds herself in total
					darkness. There are screams and cries down the hall, and
					without even thinking, Lindsay rushes to help. Finding a
					pudgy Hufflepuff stumbling in the hall, she asks if he is
					alright. But the look in his eyes reveals the truth. Lindsay
					has read about it time and again in her books: the Imperious
					Curse! It seems one of the followers of Voldermort's
					thinking have found their way into the castle!
				</Card.Body>
				<Card.Body>
					Quickly stunning the Hufflepuff boy, she remembers something
					her grandmother told her. The Defense Against the Dark Arts
					teacher had just developed a counter-curse for the
					Unforgiveable Curse. She sets out for his classroom, in
					hopes that something there might help her. Though she knows
					more about magic than anyone at the school, she is also
					inexperienced with it. She's not worried though.
				</Card.Body>
				<Card.Body>She is grandma's favourite after all...</Card.Body>
				<Button
					onClick={() => props.changeStatus("instructions")}
					className="start-button"
					variant="success"
					vertical="true"
					block
				>
					Next
				</Button>
			</Card>
		</div>
	);
};
