import _ from "lodash";

export default (state = [], { type, payload }) => {
	if (type === "GET_PRODUCTS") {
		return [...payload];
	}

	if (type === "DELETE_PRODUCT") {
		const newData = state.filter((product, index) => {
			return product._id !== payload.id;
		});

		if (payload.data) {
			newData.push(payload.data);
		}

		return newData;
	}

	if (type === "MODIFY_PRODUCT") {
		var newData = [...state];
		newData[payload.index] = payload.data;
		return newData;
	}

	if (type === "INSERT_MORE_PRODUCTS") {
		return [...state, ...payload];
	}

	return state;
};
