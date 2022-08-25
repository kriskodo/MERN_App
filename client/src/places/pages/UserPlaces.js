import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useParams } from "react-router-dom";

const UserPlaces = (props) => {
	const [places, setPlaces] = useState(null);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const userId = useParams().uid;

	useEffect(() => {
		try {
			const httpSendRequest = async () => {
				const responseData = await sendRequest("http://localhost:5000/api/places/user/" + userId);
				setPlaces(responseData.places);
			};

			httpSendRequest();
		} catch (err) {

		}
	}, [sendRequest, userId, props.location]);

	return (
		<React.Fragment>
			<ErrorModal
				error={error}
				onClear={clearError}
			/>
			{isLoading && <LoadingSpinner asOverlay />}
			{!isLoading && <PlaceList places={places} />}
		</React.Fragment>
	);
};

export default UserPlaces;
