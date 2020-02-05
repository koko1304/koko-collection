import _ from "lodash";

export default (state = null, { type, payload }) => {
	if (type === "STORE_FILES") {
		return _.values(payload);
	}

	if (type === "REMOVE_FILE") {
		return state.filter((item, index) => {
			return index !== payload;
		});
	}

	if (type === "ADD_MORE_PRODUCTS") {
		const copyState = [...state];

		for (var i = 0; i < payload.length; i++) {
			copyState.push(payload[i]);
		}

		return copyState;
	}

	if (type === "CHANGE_FILE") {
		const copyState = [...state];
		copyState[payload.index] = payload.file;

		return copyState;
	}

	return state;
};
