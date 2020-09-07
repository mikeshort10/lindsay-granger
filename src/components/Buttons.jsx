import React from "react";

/*iconDown(code) {
    this.move(code);
    this.setState({
      iconDown: setInterval(() => {
        this.move(code);
      }, 100)
    });
  }

  iconUp(code) {
    this.keyup(code);
    clearInterval(this.state.iconDown);
  }

  iconClick(code) {
    this.move(code);
    this.keyup(code);
  }*/

module.exports = function(props) {
	let chevCir = "fas fa-chevron-circle-";
	let up = chevCir + "up";
	let down = chevCir + "down";
	let left = chevCir + "left";
	let right = chevCir + "right";
	let iconUp = props.iconUp;
	let iconDown = props.iconDown;

	function Button(props) {
		return (
			<div
				className={props.divClass}
				onTouchStart={() => iconDown(props.keyVal)}
				onTouchEnd={() => iconUp(props.keyVal)}
			>
				<i className={props.iconClass} />
			</div>
		);
	}

	function createButtons() {
		let arr = [];
		let iC = [left, up, right, down];
		let dC = ["left", "up", "right", "down"];
		for (let i = 0; i < 4; i++) {
			arr.push(
				<Button divClass={dC[i]} iconClass={iC[i]} keyVal={i + 37} />,
			);
		}
		return arr;
	}

	return <div className="buttons"> {createButtons()} </div>;
};
