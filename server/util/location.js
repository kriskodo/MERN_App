const axios = require("axios");

const API_KEY = "AIzaSyDoNvyn7CoeKC8idWjVbHG3CKYnZxj-Wig";

async function getCoordsForAddress(address) {
	const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
	const data = response.data;

	if (!data || data.status === "ZERO_RESULTS") {
		throw new HttpError("Address not found", 404);
	}

	return data.results[0].geometry.location;
}

exports.getCoordsForAddress = getCoordsForAddress;