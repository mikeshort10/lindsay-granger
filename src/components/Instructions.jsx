import React from "react";
import { Card, Button } from "react-bootstrap";

function Instructions(props) {
	return (
		<div>
			<Card
				style={{ color: "white", backgroundColor: "black" }}
				className="text-center border-none"
			>
				<Card.Header
					style={{ color: "black", backgroundColor: "white" }}
					className="header"
				>
					How To Play
				</Card.Header>
				<Card.Header
					style={{ color: "black", backgroundColor: "white" }}
					className="header-placeholder"
				>
					H
				</Card.Header>
				<Card.Body>
					You are at the center of Hogwarts. Without the lights, the
					castle is a maze to a first-year. Setting his victims to
					curse even more students, the Death Eater{" "}
					<i className="fas fa-skull" /> has sealed himself in one of
					the classrooms. Find the counter-curse{" "}
					<i className="fas fa-book book" />
					to defeat the Death Eater!
				</Card.Body>
				<Card.Body>
					You may have taken out one Hufflepuff second-year, but more
					talented students may have fallen under the Imperius Curse
					as well. Defeat your schoolmates{" "}
					<i className="fas fa-hat-wizard hufflepuff" />{" "}
					<i className="fas fa-hat-wizard ravenclaw" />{" "}
					<i className="fas fa-hat-wizard slytherin" /> and find
					scrolls <i className="fas fa-scroll" /> to increase your
					experience and skills. If you do suffer any damage, there
					may be a few potions <i className="fas fa-flask potion" />{" "}
					around the castle that can help you.
				</Card.Body>
				<Card.Body>
					Use the arrow keys to move or use them with "A" to attack.
					Good luck!
				</Card.Body>
				<Button
					className="start-button"
					onClick={() => props.changeStatus("select")}
					variant="success"
					vertical="true"
					block
				>
					Next
				</Button>
			</Card>
		</div>
	);
}

export { Instructions };
