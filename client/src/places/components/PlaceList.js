import React from "react";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";

import "./PlaceList.css";
import Button from "../../shared/components/FormElements/Button";

const PlaceList = (props) => {
	if (!props.places || props.places.length === 0) {
		return (
			<div className="place-list center">
				<Card className="card--padding">
					<h2>No places found. Maybe create one?</h2>

					<Button to="/places/new">
						Share Place
					</Button>
				</Card>
			</div>
		);
	}

	return (
		<ul className="place-list">
			{props.places.map((place) => (
				<PlaceItem
					key={place.id}
					id={place.id}
					title={place.title}
					image={place.image}
					description={place.description}
					address={place.address}
					creatorId={place.creator}
					coordinates={place.location}
				/>
			))}
		</ul>
	);
};

export default PlaceList;
