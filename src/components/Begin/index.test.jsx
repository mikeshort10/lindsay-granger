import { shallow } from "enzyme";
import React from "react";
import { Begin } from "./index";
import { Card, Button } from "react-bootstrap";

describe("<Begin />", () => {
	const props = {
		changeStatus: jest.fn,
	};
	test("renders without crashing", () => {
		shallow(<Begin {...props} />);
	});

	describe("renders correctly", () => {
		let wrapper;
		beforeEach(() => {
			const props = {
				changeStatus: jest.fn,
			};
			wrapper = shallow(<Begin {...props} />);
		});
		test("Card renders", () => {
			expect(wrapper.props().children).toContain;
		});
	});
});
