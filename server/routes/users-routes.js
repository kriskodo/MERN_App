const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const usersControllers = require("../contollers/users-controllers");

router.post(
	"/signup",
	[
		check("name")
			.not()
			.isEmpty(),
		check("email")
			.normalizeEmail()
			.isEmail(),
		check("password")
			.isLength({ min: 6 })
	],
	usersControllers.userSignUp);

router.post("/login", usersControllers.userLogIn)

router.get("/", usersControllers.getAllUsers);

module.exports = router;