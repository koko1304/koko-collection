import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";

// Action Creators
import { isLogin } from "./actions";

import App from "./app";

// Check is user already login
store.dispatch(isLogin()).then(() => {
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>,
		document.querySelector("#root")
	);
});
