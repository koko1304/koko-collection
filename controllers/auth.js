const passport = require("passport");

require("../services/auth-local");

const requireLogin = passport.authenticate("local");

module.exports = app => {
	app.post("/api/auth/login", requireLogin, (req, res) => {
		res.send(true);
	});

	app.get("/api/auth/logout", (req, res) => {
		req.logout();

		if (!req.user) {
			return res.send(false);
		}

		res.send(true);
	});

	app.get("/api/auth/islogin", (req, res) => {
		if (!req.user) {
			return res.send(false);
		}

		res.send(true);
	});
};
