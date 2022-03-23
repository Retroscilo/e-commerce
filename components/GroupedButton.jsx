import React from "react";
import { Button } from "@mui/material";
import { ButtonGroup } from "@mui/material";

class GroupedButtons extends React.Component {
	state = { counter: this.props.counter, max: this.props.max };

	handleIncrement = () => {
		if (this.props.counter === this.state.max) return;
		this.props.setCounter(this.props.counter + 1);
	};

	handleDecrement = () => {
		this.props.setCounter(this.props.counter - 1);
	};
	render() {
		const displayCounter = this.props.counter > 0;

		return (
			<ButtonGroup size="small" aria-label="small outlined button group">
				<Button onClick={this.handleIncrement}>+</Button>
				{displayCounter && (
					<Button disabled>{this.props.counter}</Button>
				)}
				{displayCounter && (
					<Button onClick={this.handleDecrement}>-</Button>
				)}
			</ButtonGroup>
		);
	}
}

export default GroupedButtons;
