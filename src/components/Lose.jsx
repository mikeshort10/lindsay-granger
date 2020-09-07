import React from "react";
import { Card, Button } from "react-bootstrap";

function Lose(props) {
	return (
		<div className="message text-center">
			<Card id="controls border-none">
				<Card.Header>{"You " + props.status}</Card.Header>
				<Card.Body>
					<Button
						variant="primary"
						onClick={() => props.changeStatus("select")}
					>
						Replay
					</Button>
				</Card.Body>
			</Card>
		</div>
	);
}

export { Lose };
