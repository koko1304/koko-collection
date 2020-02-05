export default (state = "", { type, payload }) => {
	if (type === "AUTH_ERROR") {
		return payload;
	}

	return state;
};
