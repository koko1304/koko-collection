const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const autoIncrement = require("mongoose-auto-increment");

const app = express();
const port = process.env.PORT || 3000;
const { cookieSecret } = require("./configs/keys");
const CONNECTION_STRING = require("./configs/mongodb");

mongoose.connect(CONNECTION_STRING, err => {
	if (err) console.log(err);

	autoIncrement.initialize(mongoose.connection);

	app.use(cors());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(
		cookieSession({
			maxAge: 31 * 24 * 60 * 60 * 1000,
			keys: [cookieSecret]
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());

	require("./controllers")(app);

	app.use(express.static("build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "build", "index.html"));
	});

	console.log("Connected to mongodb atlas");

	app.listen(port, () => {
		console.log("Server is running on port", port);
	});
});
