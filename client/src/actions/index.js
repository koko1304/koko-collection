import axios from "axios";
import _ from "lodash";

export const login = values => async dispatch => {
	try {
		const response = await axios.post("/api/auth/login", values);

		dispatch({
			type: "AUTH",
			payload: response.data
		});
	} catch (err) {
		dispatch({
			type: "AUTH_ERROR",
			payload: "Incorrect Username and Password"
		});
	}
};

export const clearErr = () => dispatch =>
	dispatch({
		type: "AUTH_ERROR",
		payload: ""
	});

export const isLogin = () => async dispatch => {
	const response = await axios.get("/api/auth/islogin");

	dispatch({
		type: "AUTH",
		payload: response.data
	});
};

export const logout = () => async dispatch => {
	const response = await axios.get("/api/auth/logout");

	dispatch({
		type: "AUTH",
		payload: response.data
	});
};

export const createFiles = files => async dispatch => {
	const fileLimited = _.filter(files, (file, key) => {
		return key < 10;
	});

	await dispatch({
		type: "STORE_FILES",
		payload: fileLimited
	});
};

export const removeFile = index => dispatch =>
	dispatch({
		type: "REMOVE_FILE",
		payload: index
	});

export const submitProducts = (values, files) => async dispatch => {
	const data = new FormData();

	values.products.forEach(product => {
		data.append("buy", product.buy);
		data.append("sale", product.sale);
	});

	files.forEach(file => {
		data.append("files", file);
	});

	const response = await axios.post("/api/products", data);
};

export const getProducts = () => async dispatch => {
	const response = await axios.get("/api/products");

	if (!response.data) {
		dispatch({
			type: "NO_MORE_PRODUCTS"
		});
	} else {
		dispatch({
			type: "GET_PRODUCTS",
			payload: response.data
		});
	}
};

export const hasMoreProducts = () => async dispatch =>
	dispatch({
		type: "HAS_MORE_PRODUCTS"
	});

export const getMoreProducts = page => async dispatch => {
	const response = await axios.get(`/api/products/${page}`);

	if (!response.data) {
		dispatch({
			type: "NO_MORE_PRODUCTS"
		});
	} else {
		dispatch({
			type: "INSERT_MORE_PRODUCTS",
			payload: response.data
		});
	}
};

export const deleteProduct = (id, page) => async dispatch => {
	const response = await axios.delete(`/api/products/${id}/${page}`);

	if (!response.data) {
		dispatch([
			{
				type: "NO_MORE_PRODUCTS"
			},
			{
				type: "DELETE_PRODUCT",
				payload: {
					id,
					data: response.data
				}
			}
		]);
	} else {
		dispatch({
			type: "DELETE_PRODUCT",
			payload: {
				id,
				data: response.data
			}
		});
	}
};

export const toggleEdit = id => async dispatch => {
	dispatch({
		type: "TOGGLE_EDIT",
		payload: id
	});
};

export const modifyProduct = (id, values, file, index) => async dispatch => {
	var response;

	if (file) {
		const data = new FormData();

		data.append("buy", values.buy);
		data.append("sale", values.sale);
		data.append("file", file);

		response = await axios.put(`/api/products/${id}`, data);
	} else {
		const data = {
			buy: values.buy,
			sale: values.sale
		};

		response = await axios.put(`/api/products/${id}`, data);
	}

	const dataUpdate = {
		index: index,
		data: {
			_id: id,
			sale: values.sale,
			buy: values.buy,
			picturePath: response.data.picturePath,
			date: values.date,
			modifyDate: values.modifyDate
		}
	};

	dispatch({
		type: "MODIFY_PRODUCT",
		payload: dataUpdate
	});
};

export const addMoreProducts = files => async dispatch =>
	await dispatch({
		type: "ADD_MORE_PRODUCTS",
		payload: files
	});

export const changeFile = (file, index) => async dispatch =>
	await dispatch({
		type: "CHANGE_FILE",
		payload: {
			file,
			index
		}
	});
