module.exports = app => {
	require("./root")(app);

	require("./auth")(app);

	require("./products")(app);
};
