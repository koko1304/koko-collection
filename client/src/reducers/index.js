import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

// Reducers
import Auth from "./auth";
import AuthError from "./auth-error";
import Files from "./files";
import Products from "./products";
import ToggleEdit from "./toggle-edit";
import CheckProducts from "./check-products";

export default combineReducers({
	form: formReducer,
	authErr: AuthError,
	auth: Auth,
	files: Files,
	products: Products,
	editId: ToggleEdit,
	checkProducts: CheckProducts
});
