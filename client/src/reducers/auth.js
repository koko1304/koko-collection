export default (state = false, { type, payload }) => {
	if (type === "AUTH") {
		return payload;
	}

	return state;
};
