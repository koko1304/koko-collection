import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Pages
import HomePage from "./pages";
import ProductsPage from "./pages/products";
import ProductsAddPage from "./pages/products-add";

// Components
import RequiredAuth from "./components/required-auth";

const App = () => {
	return (
		<Router>
			<div>
				<Route exact path="/" component={HomePage} />
				<Route exact path="/products" component={RequiredAuth(ProductsPage)} />
				<Route path="/products/add" component={RequiredAuth(ProductsAddPage)} />
			</div>
		</Router>
	);
};

export default App;
