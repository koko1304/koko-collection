export default (state = null, { type, payload }) => {
	if (type === "TOGGLE_EDIT") {
		return payload;
	}

	return state;
};
