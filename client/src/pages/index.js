import React, { Component } from "react";
import Header from "../components/header";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";

// Action Creators
import { login, clearErr } from "../actions";

class HomePage extends Component {
	createInputField({ meta: { touched, error, invalid }, input, label, type }) {
		return (
			<div className="form-group">
				<label htmlFor={input.name}>{label}</label>
				<input id={input.name} type="text" className={`form-control ${touched && invalid ? "is-invalid" : ""}`} {...input} type={type} />
				<p className="invalid-feedback">{touched ? error : ""}</p>
			</div>
		);
	}

	handleSubmit(values) {
		const login = this.props.login(values);
	}

	componentWillUpdate(nextProps) {
		if (nextProps.auth) {
			this.props.history.push("/products");
		}
	}

	componentWillUnmount() {
		this.props.clearErr();
	}

	alertError() {
		if (this.props.authErr) {
			return <div className="alert alert-danger">{this.props.authErr}</div>;
		}
	}

	render() {
		return (
			<div id="home-page">
				<Header page="home" exclude={["Products"]} />
				<div className="container py-5">
					<form id="loginForm" className="card m-auto bg-light" onSubmit={this.props.handleSubmit(this.handleSubmit.bind(this))}>
						<div className="card-body">
							<h2 className="card-title">Login</h2>
							<Field name="username" type="text" label="Username:" component={this.createInputField} />
							<Field name="password" type="password" label="Password:" component={this.createInputField} />
							{this.alertError()}
							<button type="submit" className="btn btn-primary">
								Login
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

function validation(values) {
	var errors = {};

	if (!values.username) {
		errors.username = "Username is required";
	}

	if (!values.password) {
		errors.password = "Password is required";
	}

	return errors;
}

export default reduxForm({
	validate: validation,
	form: "login-form"
})(connect(({ auth, authErr }) => ({ auth, authErr }), { login, clearErr })(HomePage));
