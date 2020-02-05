const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { userName, passWord, secretID } = require("../configs/keys");

passport.use(
	new LocalStrategy((username, password, done) => {
		if (!username || !password) {
			return done(null, false);
		}

		if (username !== userName) {
			return done(null, false);
		}

		if (password !== passWord) {
			return done(null, false);
		}

		return done(null, true);
	})
);

passport.serializeUser((user, done) => {
	done(null, secretID);
});

passport.deserializeUser((id, done) => {
	if (id === secretID) {
		done(null, true);
	}
});
