import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { reduxForm, Field } from "redux-form";
import Loader from "react-loader";
import moment from "moment";

// Action Creators
import { getProducts, deleteProduct, toggleEdit, modifyProduct, getMoreProducts } from "../actions";

import Header from "../components/header";

class ProductsPage extends Component {
	constructor(props) {
		super(props);

		this.fetching = false;
		this.page = 1;
		this.eventLis = true;
		this.height = 0;
		this.html = document.querySelector("html");
		this.eventSet = false;

		this.state = {
			delBtn: {},
			height: 0
		};
	}

	componentWillMount() {
		this.props.getProducts().then(() => {
			this.setState({ height: document.documentElement.offsetHeight - 800 }, () => {
				this.height = this.state.height;

				this.handleScroll();
			});
		});
	}

	checkBottomPage = () => {
		if (this.html.scrollTop > this.height && !this.fetching && this.props.checkProducts) {
			this.fetching = true;

			this.props.getMoreProducts(this.page).then(() => {
				this.setState({ height: document.documentElement.offsetHeight - 800 }, () => {
					this.height = this.state.height;
					this.fetching = false;

					this.page++;
				});
			});
		}
	};

	handleScroll() {
		if (this.height !== 0 && this.eventLis) {
			this.eventLis = false;
			this.eventSet = true;

			document.addEventListener("scroll", this.checkBottomPage);
		}
	}

	componentWillUnmount() {
		if (this.eventSet) {
			document.removeEventListener("scroll", this.checkBottomPage);
		}
	}

	handleDelete(id) {
		const userAnswer = confirm("Are you sure!");

		if (userAnswer) {
			this.setState(prevState => {
				const newState = { ...prevState };
				newState[id] = true;

				return { delBtn: newState };
			});

			this.props.deleteProduct(id, this.page).then(() => {
				this.setState(prevState => {
					const newState = _.omit(prevState, id);

					return { delBtn: newState };
				});
			});
		}
	}

	handleSubmit = (values, index) => {
		const id = this.props.editId;
		const file = this.refs.file.files[0];

		const promise = this.props.modifyProduct(id, values, file, index);

		promise.then(() => {
			this.props.toggleEdit(null);
			this.initEdit = null;
		});

		return promise;
	};

	handleCreateInputField({ meta: { touched, invalid, error }, input, label }) {
		return (
			<div className="form-group">
				<label htmlFor={input.name}>{label}</label>
				<div className="input-group">
					<input {...input} id={input.name} type="number" className={`form-control ${touched && invalid ? "is-invalid" : ""}`} />
					<div className="input-group-append">
						<span className="input-group-text">$</span>
					</div>
				</div>
				<div className="form-control is-invalid p-0 border-0" />
				<p className="invalid-feedback">{touched ? error : ""}</p>
			</div>
		);
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.editId !== null && this.initEdit !== nextProps.editId) {
			const product = this.props.products.find((product, index) => {
				return product._id === nextProps.editId;
			});

			this.initEdit = nextProps.editId;
			// Set default value to the redux field
			this.props.initialize({ buy: product.buy.toString(), sale: product.sale.toString(), date: product.date.toString(), modifyDate: moment().format("DD-MM-YYYY") });
		}
	}

	handleCancel() {
		this.props.toggleEdit(null);
		this.initEdit = null;
		this.props.destroy();
	}

	isPristine(pristine) {
		var file;

		if (!this.refs.file) {
			file = null;
		} else {
			file = this.refs.file.value || null;
		}

		return pristine && !file;
	}

	shouldDisable = id => {
		if (this.state.delBtn[id]) {
			return true;
		}

		return false;
	};

	handleGenerateCard(product, index) {
		if (this.props.editId === product._id) {
			const { pristine, submitting, invalid } = this.props;

			return (
				<form onSubmit={this.props.handleSubmit(values => this.handleSubmit(values, index))} className="card">
					<div className="normal">
						<Loader loaded={!submitting} />
					</div>
					<div style={{ backgroundImage: `url("/${product.picturePath}")`, backgroundSize: "cover", backgroundPosition: "center center", height: "250px" }} className="card-img-top" />
					<div className="card-header">Editing Product Id: P{product._id}</div>
					<div className="card-body">
						<div className="form-group">
							<label htmlFor="file">Product Picture</label>
							<input ref="file" onChange={() => this.forceUpdate()} type="file" id="file" name="productPic" className="form-control" />
						</div>
						<Field name="buy" label="Buy Price" component={this.handleCreateInputField} />
						<Field name="sale" label="Sale Price" component={this.handleCreateInputField} />
						<Field name="date" type="hidden" component="input" />
						<Field name="modifyDate" type="hidden" component="input" />
					</div>
					<div className="card-footer">
						<button disabled={this.isPristine.call(this, pristine) || submitting || invalid} type="submit" className="btn btn-primary mr-3">
							Save
						</button>
						<button type="button" onClick={this.handleCancel.bind(this)} className="btn btn-danger">
							Cancel
						</button>
					</div>
				</form>
			);
		}

		return (
			<div className="card">
				<div style={{ backgroundImage: `url("/${product.picturePath}")`, backgroundSize: "cover", backgroundPosition: "center center", height: "250px" }} className="card-img-top" />
				<div className="card-header">Product Id: P{product._id}</div>
				<div className="card-body">
					<div className="card-text">Buy Price: {product.buy}$</div>
					<div className="card-text">Sale Price: {product.sale}$</div>
					<div className="card-text">Create Date: {product.date}</div>
					<div className="card-text">Modify Date: {product.modifyDate || "None"}</div>
				</div>
				<div className="card-footer">
					<button onClick={() => this.props.toggleEdit(product._id)} className="btn btn-primary mr-3">
						Edit
					</button>
					<button disabled={this.shouldDisable(product._id)} onClick={() => this.handleDelete(product._id)} className="btn btn-danger">
						Delete
					</button>
				</div>
			</div>
		);
	}

	getProductListItems() {
		return this.props.products.map((product, index) => {
			return (
				<li key={product._id} className="col-md-4 mt-4">
					{this.handleGenerateCard.call(this, product, index)}
				</li>
			);
		});
	}

	render() {
		return (
			<div id="products-page">
				<Header page="products" exclude={["home", "products"]} />
				<div className="container py-5">
					<h1>Products</h1>
					<hr />
					<ul className="row" style={{ listStyleType: "none", padding: "0px", marginTop: "-1.5rem" }}>
						{this.getProductListItems.call(this)}
					</ul>
					<div className="scroll" style={{ height: `${this.props.checkProducts ? "200px" : "0"}` }}>
						<Loader loaded={!this.props.checkProducts} />
					</div>
					<div className="alert alert-danger text-center" style={{ display: `${this.props.checkProducts ? "none" : "block"}` }}>
						No More Products
					</div>
				</div>
			</div>
		);
	}
}

function validation(values) {
	const errors = {};
	const { buy, sale, file } = values;

	if (!buy) {
		errors.buy = "Buy Price is required";
	}

	if (!sale) {
		errors.sale = "Sale Price is required";
	}

	return errors;
}

export default reduxForm({
	form: "edit-product",
	validate: validation
})(connect(({ products, editId, checkProducts }) => ({ products, editId, checkProducts }), { getProducts, deleteProduct, toggleEdit, modifyProduct, getMoreProducts })(ProductsPage));
