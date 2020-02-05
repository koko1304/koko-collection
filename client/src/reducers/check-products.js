export default (state = true, { type, payload }) => {
	if (type === "NO_MORE_PRODUCTS") {
		return false;
	}

	if (type === "HAS_MORE_PRODUCTS") {
		return true;
	}

	return state;
};
