import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import _ from "lodash";
import { connect } from "react-redux";

// Action Creators
import { logout, createFiles } from "../actions";

class Header extends Component {
	isActive(page) {
		if (page === this.props.page) {
			return "active";
		}
	}

	createNavItems() {
		var items = [
			{
				page: "Home",
				path: "/"
			},
			{
				page: "Products",
				path: "/products"
			}
		];

		if (this.props.exclude) {
			items = items.filter(({ page }) => !this.props.exclude.find(value => value.toLowerCase() === page.toLowerCase()));
		}

		return items.map(({ page, path }) => {
			return (
				<li key={page.toLowerCase()} className="nav-items">
					<Link className={`nav-link ${this.isActive(page.toLowerCase())}`} to={path}>
						{page}
					</Link>
				</li>
			);
		});
	}

	handleLogout() {
		this.props.logout();
	}

	handleAddProducts(e) {
		this.props.createFiles(e.target.files).then(() => {
			this.props.history.push("/products/add");
		});
	}

	isLogin() {
		if (this.props.auth) {
			return [
				<div key="addproducts" className={`form-inline mr-3 ${this.props.page === "add-products" ? "d-none" : ""}`}>
					<label htmlFor="add" className="btn btn-primary">
						Add Products
					</label>
					<input id="add" accept=".jpg,.png" onChange={this.handleAddProducts.bind(this)} className="d-none" type="file" multiple />
				</div>,
				<button key="logout" onClick={this.handleLogout.bind(this)} className="btn btn-outline-danger">
					Log out
				</button>
			];
		}
	}

	render() {
		return (
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
				<div className="container">
					<Link className="navbar-brand" to="/">
						Navbar
					</Link>
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon" />
					</button>

					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav mr-auto">{this.createNavItems()}</ul>
						{this.isLogin.call(this)}
					</div>
				</div>
			</nav>
		);
	}
}

export default connect(({ auth }) => ({ auth }), { logout, createFiles })(withRouter(Header));
