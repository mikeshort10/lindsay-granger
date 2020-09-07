import React from "react";
import { Card, ProgressBar } from "react-bootstrap";

export const Stats = function(props) {
	const { level, HP, maxHP, XP } = props.player;
	const { lumosPlus, hasCloak, alohomora } = props.abilities;
	const colSize = "col-xs-3 ";
	const hasLumos = colSize + lumosPlus ? "far fa-lightbulb" : "hide-icon";
	const cloaked = colSize + hasCloak ? "fas fa-mask" : "hide-icon";
	const unlock = colSize + alohomora ? "fas fa-book" : "hide-icon";

	return (
		<Card id="stats-panel">
			<Card.Body id="stats">
				{"Level " + level}
				<br />
				<ProgressBar key={1} className="black-font">
					XP <ProgressBar now={XP} max={level * 10} />
				</ProgressBar>
				<ProgressBar key={2} className="black-font">
					HP <ProgressBar variant="success" now={HP} max={maxHP} />
				</ProgressBar>
				<div className="row">
					<i className={hasLumos} />
					<i className={cloaked} />
					<i className={unlock} />
				</div>
			</Card.Body>
		</Card>
	);
};
