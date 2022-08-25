const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const getAllUsers = async (req, res, next) => {
		let users;
		
		try {
				// Extract the users data, but do not show the password.
				users = await User.find({}, '-password');
		} catch (err) {
				return next(new HttpError("Could not find users. Please try again"), 500);
		}
		
		res.status(200).json({ users: users.map(u => u.toObject({ getters: true })) });
};

const userSignUp = async (req, res, next) => {
		const errors = validationResult(req);
		
		if (!errors.isEmpty()) {
				return next(new HttpError("Invalid inputs.", 422));
		}
		
		const { email, name, password } = req.body;
		let existingUser;
		
		try {
				existingUser = await User.findOne({ email });
		} catch (err) {
				return next(new HttpError("Signing up failed, please try again later."), 500);
		}
		
		if (existingUser) {
				return next(new HttpError("User already exists, please login instead.", 422));
		}
		
		const createdUser = new User({
				name,
				email,
				password,
				image: "https://images.unsplash.com/photo-1635344902053-3a9e4a5506d2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=928&q=80",
				places: [],
		});
		
		try {
				await createdUser.save();
		} catch (err) {
				return next(new HttpError("Signing up failed. Please try again.", 500));
		}
		
		res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const userLogIn = async (req, res, next) => {
		const { email, password } = req.body;
		
		let user;
		try {
				user = await User.findOne({ email, password });
		} catch (err) {
				return next(new HttpError("Could not process the data.", 422));
		}
		
		if (!user) {
				return next(new HttpError("Invalid credentials. Please try again.", 401));
		}
		
		res.status(200).json({ message: "Logged in", user: user.toObject({getters: true}) });
};

exports.userSignUp = userSignUp;
exports.getAllUsers = getAllUsers;
exports.userLogIn = userLogIn;