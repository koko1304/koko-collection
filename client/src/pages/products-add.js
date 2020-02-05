import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field, FieldArray } from "redux-form";
import store from "../store";
import { Link } from "react-router-dom";
import Loader from "react-loader";
import _ from "lodash";

import Header from "../components/header";

// action creators
import { removeFile, submitProducts, addMoreProducts, changeFile, hasMoreProducts } from "../actions";

class ProductsAddPage extends Component {
	componentWillMount() {
		if (!this.props.files) {
			return this.props.history.push("/products");
		}

		var initialItems = [];

		for (var i = 0; this.props.files.length > i; i++) {
			initialItems.push({});
		}

		this.props.initialize({ products: initialItems });
	}

	createImage(index) {
		var reader = new FileReader();

		reader.onload = function(e) {
			document.querySelector(`#img-${index}`).style.backgroundImage = `url("${e.target.result}")`;
		};

		reader.readAsDataURL(this.props.files[index]);
	}

	handleRemoveProducts(index, fields) {
		this.props.removeFile(index);

		fields.remove(index);
	}

	createInputField({ meta: { touched, invalid, error }, input, label }) {
		return (
			<div className="form-group">
				<label htmlFor={input.name}>{label}</label>
				<div className="input-group">
					<input type="number" placeholder="Enter your price" id={input.name} {...input} className={`form-control ${touched && invalid ? "is-invalid" : ""}`} />
					<div className="input-group-append">
						<span className="input-group-text">$</span>
					</div>
				</div>
				<div className="form-control is-invalid p-0 border-0" />
				<p className="invalid-feedback">{touched ? error : ""}</p>
			</div>
		);
	}

	handleChangeImage(index, e) {
		this.props.changeFile(e.target.files[0], index).then(() => {
			this.createImage(index);
		});
	}

	createAddMoreBtn(productsCount) {
		if (productsCount < 10) {
			return (
				<label className="btn btn-primary w-100" htmlFor="addmore">
					Add More
				</label>
			);
		}

		return null;
	}

	createFieldArray = ({ fields, meta: { error, submitFailed } }) => {
		return (
			<div>
				<ul className="row" style={{ listStyleType: "none", padding: "0px", marginTop: "-1.5rem" }}>
					{fields.map((product, index) => (
						<li key={index} id={index} className="col-md-4 mt-4">
							<div className="card">
								{this.createImage.call(this, index)}
								<div className="card-img-top" style={{ backgroundSize: "cover", backgroundPosition: "center center", height: "250px" }} id={`img-${index}`} />
								<div className="card-body">
									<Field name={`${product}.buy`} label="Product Price" component={this.createInputField} />
									<Field name={`${product}.sale`} label="Product Sale Price" component={this.createInputField} />
								</div>
								<div className="card-footer">
									<label className="btn btn-primary mr-3 mb-0" htmlFor={`changeimg-${index}`}>
										Change Picture
									</label>
									<input type="file" onChange={e => this.handleChangeImage(index, e)} className="d-none" id={`changeimg-${index}`} />
									<button type="button" onClick={() => this.handleRemoveProducts(index, fields)} className="btn btn-danger h-25">
										Remove
									</button>
								</div>
							</div>
						</li>
					))}
				</ul>
				{this.createAlertErr(error, submitFailed)}
				{this.createAddMoreBtn(fields.length)}
				<input className="d-none" id="addmore" onChange={e => this.handleAddMoreProducts(e, fields)} multiple type="file" accept=".jpg,.png" />
			</div>
		);
	};

	createAlertErr(error, submitFailed) {
		if (error || submitFailed) {
			return <p className="alert alert-danger w-100">{error}</p>;
		}
	}

	handleSubmit = values => {
		const submit = this.props.submitProducts(values, this.props.files);

		submit.then(() => {
			this.props.history.push("/products");

			this.props.hasMoreProducts();
		});

		return submit;
	};

	handleAddMoreProducts = (e, fields) => {
		const files = e.target.files;

		if (files) {
			const filesLeft = 10 - this.props.files.length;

			const filterFiles = _.filter(files, (file, index) => {
				return index < filesLeft;
			});

			this.props.addMoreProducts(filterFiles).then(() => {
				_.forEach(filterFiles, () => {
					fields.push({});
				});
			});
		}
	};

	render() {
		const { submitting, invalid } = this.props;

		return (
			<div id="products-add-page">
				<Header page="add-products" exclude={["home"]} />
				<div className="normal">
					<Loader loaded={!submitting} />
				</div>
				<div className="container py-5">
					<form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
						<FieldArray name="products" component={this.createFieldArray} />
						<div className="mt-3">
							<button disabled={submitting || invalid} className="btn btn-primary mr-3" type="submit">
								SAVE PRODUCTS
							</button>
							<Link className="btn btn-danger" to="/products">
								CANCEL
							</Link>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

function validation(values) {
	const errors = {};

	if (!values.products || !values.products.length) {
		errors.products = { _error: "No product to save!!" };
	} else {
		const productArrayErrors = [];

		values.products.forEach((product, productIndex) => {
			const productErrors = {};

			if (!product.buy) {
				productErrors.buy = "Product Price is required";
				productArrayErrors[productIndex] = productErrors;
			}

			if (!product.sale) {
				productErrors.sale = "Product Sale Price is required";
				productArrayErrors[productIndex] = productErrors;
			}
		});

		if (productArrayErrors.length) {
			errors.products = productArrayErrors;
		}
	}

	return errors;
}

export default reduxForm({
	form: "add-products-form",
	validate: validation
})(connect(({ files }) => ({ files }), { removeFile, submitProducts, addMoreProducts, changeFile, hasMoreProducts })(ProductsAddPage));
