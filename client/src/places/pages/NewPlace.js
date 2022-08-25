import React, { useContext } from 'react';
import './PlaceForm.css';

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { useHistory } from "react-router-dom";
import { useForm } from "../../shared/hooks/FormHook";
import { useHttpClient } from "../../shared/hooks/HttpHook";

import { AuthContext } from "../../shared/context/AuthContext";

const NewPlace = () => {
	const auth = useContext(AuthContext);
	const history = useHistory();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [formState, inputHandler] = useForm({
		title: {
			value: "",
			isValid: false,
		},
		address: {
			value: "",
			isValid: false,
		},
		description: {
			value: "",
			isValid: false,
		},
	},
		false);

	const handlePlaceSubmit = async (e) => {
		e.preventDefault();
		try {
			await sendRequest(
				"http://localhost:5000/api/places",
				"POST",
				{ "Content-Type": "application/json" },
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value,
					address: formState.inputs.address.value,
					creator: auth.userId,
				}),
			);

			history.push("/");
		} catch (err) {

		}
	};

	return (
		<>
			<ErrorModal
				error={error}
				onClear={clearError}
			/>
			<form
				className="place-form"
				onSubmit={handlePlaceSubmit}
			>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					id="title"
					element="input"
					type="text"
					label="Title"
					errorText="Please enter a valid title."
					validators={[VALIDATOR_REQUIRE()]}
					onInput={inputHandler}
				/>

				<Input
					id="description"
					element="textarea"
					type="text"
					label="Description"
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
					errorText="Please enter a valid description. (at least 5 characters.)"
					onInput={inputHandler}
				/>

				<Input
					id="address"
					type="text"
					element="input"
					errorText="Please enter a valid address."
					label="Address"
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(10)]}
					onInput={inputHandler}
				/>

				<Button
					type="submit"
					disabled={!formState.isValid}
				>
					ADD PLACE
				</Button>
			</form>
		</>
	);
};

export default NewPlace;