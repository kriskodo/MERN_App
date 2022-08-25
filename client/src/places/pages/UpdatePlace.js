import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/FormHook";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/AuthContext";

const UpdatePlace = () => {
	const [place, setPlace] = useState(null);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const authContext = useContext(AuthContext);
	const params = useParams();
	const { placeId } = params;
	const history = useHistory();

	const [formState, inputHandler, setFormData] = useForm({
		title: {
			value: place?.title || "",
			isValid: false,
		},
		description: {
			value: place?.description || "",
			isValid: false,
		},
	}, false);

	useEffect(() => {
		const fetchPlace = async () => {
			try {
				const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`);
				setPlace(responseData.place);

				// Continue here
				setFormData({
					title: {
						value: responseData.place.title,
						isValid: true,
					},
					description: {
						value: responseData.place.description,
						isValid: true,
					},
				}, true);
			} catch (e) {

			}
		};

		fetchPlace();

	}, [setFormData, placeId, sendRequest]);

	const handleUpdatePlaceSubmit = async (e) => {
		e.preventDefault();
		try {
			await sendRequest(
				`http://localhost:5000/api/places/${placeId}`,
				"PATCH",
				{
					"Content-Type": "application/json",
				},
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value,
				}),
			);

			history.push("/" + authContext.userId + "/places");
		} catch (e) {

		}

	};

	if (isLoading) {
		return (
			<LoadingSpinner asOverlay />
		);
	}

	if (!place && !error) {
		return (
			<div className="center">
				<Card>
					<h2>Place not found!</h2>
				</Card>
			</div>
		);
	}

	return (
		<React.Fragment>
			<ErrorModal
				error={error}
				onClear={clearError}
			/>
			{!isLoading && place && <form
				className="place-form"
				onSubmit={handleUpdatePlaceSubmit}
			>
				<Input
					id="title"
					element="input"
					type="text"
					label="Title"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="Please enter a valid title"
					onInput={inputHandler}
					initialValue={place?.title}
					initialValid={true}
				/>

				<Input
					id="description"
					element="textarea"
					type="text"
					label="Description"
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText="Please enter a valid description"
					onInput={inputHandler}
					initialValue={place?.description}
					initialValid={true}
				/>


				<Button
					type="submit"
					disabled={!formState.isValid}
				>
					UPDATE PLACE
				</Button>
			</form>}
		</React.Fragment>

	);
};

export default UpdatePlace;