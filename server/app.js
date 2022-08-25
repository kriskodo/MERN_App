const express = require("express");
const app = express();
const mongoose = require("mongoose");

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

app.use(express.json());

require('dotenv').config();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization",
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, HEAD, OPTIONS");
	next();
});

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
	throw new HttpError("Could not find route", 404);
});

// Special Error-Handling middleware that Express recognizes
app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}

	res
		.status(error.code || 500)
		.json({ message: error.message || "An unknown error occurred." });
});

mongoose
	.connect(process.env.mongoDbConnectionString)
	.then(() => {
		app.listen(5000);
	})
	.catch((err) => {
		return next(new HttpError("Could not load application."))
	});
