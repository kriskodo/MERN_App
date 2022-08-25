const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { getCoordsForAddress } = require("../util/location");
const Place = require("../models/Place");
const User = require("../models/User");
const mongoose = require("mongoose");

const getPlaceById = async (req, res, next) => {
		const placeId = req.params.pid;
		let place;
		
		try {
				place = await Place.findById(placeId);
		} catch (e) {
				const error = new HttpError("Something went wrong, could not find a place.", 500);
				return next(error);
		}
		
		if (!place) {
				const error = new HttpError("Could not find a place for this id.", 404);
				return next(error);
		}
		
		res.json({
				place: place.toObject({
						getters: true,
				}),
		});
};

const updatePlaceById = async (req, res, next) => {
		const errors = validationResult(req);
		
		if (!errors.isEmpty()) {
				return next(new HttpError("Invalid inputs passed", 422));
		}
		
		const {
				title,
				description,
		} = req.body;
		
		const placeId = req.params.pid;
		
		let place;
		
		try {
				place = await Place.findById(placeId);
		} catch (err) {
				return next(new HttpError("Could not find a place with the specified ID.", 500));
		}
		
		place.title = title;
		place.description = description;
		
		try {
				await place.save();
		} catch (err) {
				return next(new HttpError("Could not update the specified place." + err, 500));
		}
		
		res.status(200).json({
				place: place.toObject({ getters: true }),
		});
};

const deletePlaceById = async (req, res, next) => {
		const { pid } = req.params;
		let place;
		
		try {
				place = await Place.findById(pid).populate("creator");
		} catch (err) {
				const error = new HttpError(
						"Something went wrong, could not delete place",
						500,
				);
				
				return next(error);
		}
		
		if (!place) {
				return next(new HttpError("Could not find a place for this ID.", 404));
		}
		
		try {
				const session = await mongoose.startSession();
				session.startTransaction();
				await place.remove({ session });
				place.creator.places.pull(place);
				await place.creator.save({ session });
				await session.commitTransaction();
		} catch (err) {
				return next(new HttpError("Could not delete a place.", 500));
		}
		
		res.status(200).json({ message: "Deleted place" });
};

const getPlacesByUserId = async (req, res, next) => {
		const userId = req.params.uid;
		let userWithPlaces;
		
		try {
				userWithPlaces = await User.findById(userId).populate("places");
		} catch (err) {
				const error = new HttpError('Fetching Places failed', 500);
				return next(error);
		}
		
		if (!userWithPlaces) {
				return next(new HttpError("Could not find places for the user id.", 404));
		}
		
		res.json({
				places: userWithPlaces.places.map(place =>
						place.toObject({ getters: true })),
		});
};

const createPlace = async (req, res, next) => {
		const errors = validationResult(req);
		
		if (!errors.isEmpty()) {
				return next(new HttpError("Invalid inputs passed", 422));
		}
		
		const {
				title,
				description,
				address,
				creator,
		} = req.body;
		
		let coordinates;
		try {
				coordinates = await getCoordsForAddress(address);
		} catch (err) {
				return next(err);
		}
		
		const createdPlace = new Place({
				title,
				description,
				image: "https://upload.wikimedia.org/wikipedia/commons/4/40/Empire_State_Building_from_the_Top_of_the_Rock_%284684705924%29.jpg",
				address,
				location: coordinates,
				creator,
		});
		
		let user;
		
		try {
				user = await User.findById(creator);
		} catch (e) {
				return next(new HttpError("Creating place failed, please try again.", 500));
		}
		
		if (!user) {
				return next(new HttpError("Could not find user for provided ID.", 404));
		}
		
		/*
			Using sessions and transactions we can make sure
			everything will work properly first and then commit our changes.
			If an error occurred, all changes would be rolled back by MongoDB.
		*/
		try {
				const session = await mongoose.startSession();
				session.startTransaction();
				await createdPlace.save({ session });
				user.places.push(createdPlace);
				await user.save({ session });
				await session.commitTransaction();
		} catch (e) {
				const err = new HttpError(e, 500);
				return next(err);
		}
		
		res.status(201).json({
				place: createdPlace,
		});
};

exports.getPlaceById = getPlaceById;
exports.updatePlaceById = updatePlaceById;
exports.createPlace = createPlace;
exports.getPlacesByUserId = getPlacesByUserId;
exports.deletePlaceById = deletePlaceById;
