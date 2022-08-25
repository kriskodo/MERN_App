import React, { useEffect, useReducer } from 'react';
import { validate } from "../../util/validators";
import "./Input.css";

/* Reducer */
const inputReducer = (state, action) => {
	switch (action.type) {
		case 'CHANGE':
			return {
				...state,
				isValid: validate(action.value, action.validators),
				value: action.value,
			}
		case "ON_BLUR":
			return {
				...state,
				hasBeenFocused: true,
			}
		default:
			return state;
	}
}

/* Actions */
const actionInputChange = (e, validators) => {
	return {
		type: "CHANGE",
		value: e.target.value,
		validators,
	}
}

const actionOnBlur = () => {
	return {
		type: "ON_BLUR"
	}
}

const Input = props => {
	const initialState = {
		value: props.initialValue || "",
		isValid: props.initialValid || false,
		hasBeenFocused: false,
	}

	const [inputState, dispatch] = useReducer(inputReducer, initialState);
	const validators = props.validators;

	const { id, onInput } = props;
	const { value, isValid } = inputState;

	useEffect(() => {
		onInput(id, value, isValid);

	}, [id, value, isValid, onInput])

	/* Dispatching Actions */
	const handleInputChange = (e) => {
		dispatch(actionInputChange(e, validators))
	}

	const handleBlur = () => {
		dispatch(actionOnBlur());
	}

	const element = props.element === "input"
		? <input
			id={props.id}
			type={props.type}
			placeholder={props.placeholder}
			onChange={handleInputChange}
			onBlur={handleBlur}
			value={inputState.value}
		/>
		: <textarea
			id={props.id}
			rows={props.rows || 3}
			onChange={handleInputChange}
			onBlur={handleBlur}
			value={inputState.value}
		/>;

	return (
		<div
			className={`form-control ${!inputState.isValid && inputState.hasBeenFocused && "form-control--invalid"}`}
		>
			<label htmlFor={props.id}>{props.label}</label>
			{element}
			{!inputState.isValid && inputState.hasBeenFocused && <p>{props.errorText}</p>}
		</div>
	);
};

export default Input;