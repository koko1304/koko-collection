const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const { Schema } = mongoose;

const productSchema = new Schema({
	buy: Number,
	sale: Number,
	picturePath: String,
	date: String,
	modifyDate: {
		type: String,
		default: ""
	}
});

productSchema.plugin(autoIncrement.plugin, {
	model: "products",
	startAt: 1000
});

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;
