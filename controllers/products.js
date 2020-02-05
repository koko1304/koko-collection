const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const util = require("util");
const moment = require("moment");

const copyFile = util.promisify(fs.copyFile);
const unlink = util.promisify(fs.unlink);

const ProductModel = require("../models/product");

const storage = multer.diskStorage({
	destination: (req, file, done) => {
		done(null, "uploads");
	},
	filename: (req, file, done) => {
		const splitFileName = file.originalname.split(".");
		const extension = splitFileName[1];
		const filename = splitFileName[0];
		done(null, `${filename}-${Date.now()}.${extension}`);
	}
});

const fileFilter = (req, file, done) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		return done(null, true);
	}

	done(null, false);
};

const upload = multer({ storage, fileFilter });

const requiredAuth = require("../middlewares/required-auth");

module.exports = app => {
	app.post("/api/products", requiredAuth, upload.array("files", 10), (req, res) => {
		if (typeof req.body.buy === "object" && req.body.buy.length > 1) {
			function filter(items) {
				return items.filter((item, index) => {
					return index < 10;
				});
			}

			const buy = filter(req.body.buy);
			const sale = filter(req.body.sale);

			var newProducts = buy.map((prodBuy, index) => {
				return {
					buy: prodBuy,
					sale: sale[index],
					picturePath: req.files[index].path,
					date: moment().format("DD-MM-YYYY")
				};
			});

			req.files.forEach(file => {
				const image = sharp(file.path);
				image
					.metadata()
					.then(metadata => {
						const { width, height } = metadata;

						if (width < 800 && height < 800) {
							copyFile(file.path, path.resolve(__dirname, "../build", file.path));
						} else if (width > height) {
							return image.resize(800).toFile(path.resolve(__dirname, "../build", file.path));
						} else {
							return image.resize(null, 800).toFile(path.resolve(__dirname, "../build", file.path));
						}
					})
					.then(() => {
						unlink(file.path);
					});
			});

			ProductModel.create(newProducts, (err, products) => {
				if (err) console.log(err);

				res.send("Success");
			});
		} else {
			var newProducts = {
				buy: req.body.buy,
				sale: req.body.sale,
				picturePath: req.files[0].path,
				date: moment().format("DD-MM-YYYY")
			};

			const image = sharp(req.files[0].path);

			image
				.metadata()
				.then(metadata => {
					const { width, height } = metadata;

					if (width < 800 && height < 800) {
						copyFile(req.files[0].path, path.resolve(__dirname, "../build", req.files[0].path));
					} else if (width > height) {
						return image.resize(800).toFile(path.resolve(__dirname, "../build", req.files[0].path));
					} else {
						return image.resize(null, 800).toFile(path.resolve(__dirname, "../build", req.files[0].path));
					}
				})
				.then(() => {
					unlink(req.files[0].path);
				});

			ProductModel.create(newProducts, (err, product) => {
				if (err) console.log(err);

				res.send("Success");
			});
		}
	});

	app.get("/api/products/:page", requiredAuth, (req, res) => {
		ProductModel.find({})
			.limit(9)
			.sort({ _id: "desc" })
			.skip(9 * Number(req.params.page))
			.exec((err, products) => {
				if (products.length === 0) {
					return res.send(false);
				}

				res.send(products);
			});
	});

	app.get("/api/products", requiredAuth, (req, res) => {
		ProductModel.find({})
			.limit(9)
			.sort({ _id: "desc" })
			.exec((err, products) => {
				if (products.length === 0) {
					return res.send(false);
				}

				res.send(products);
			});
	});

	app.delete("/api/products/:id/:page", requiredAuth, (req, res) => {
		ProductModel.findByIdAndRemove(req.params.id)
			.select("picturePath -_id")
			.exec((err, product) => {
				if (err) return res.send(false);

				fs.unlink(`build/${product.picturePath}`, err => {
					if (err) return res.send(false);

					ProductModel.findOne({})
						.skip(9 * req.params.page - 1)
						.sort({ _id: "desc" })
						.exec((err, product) => {
							if (err) return res.send(false);

							if (!product) {
								return res.send(false);
							}

							res.send(product);
						});
				});
			});
	});

	app.put("/api/products/:id", requiredAuth, upload.single("file"), (req, res) => {
		const id = req.params.id;
		const { buy, sale } = req.body;

		const updateData = { buy, sale, modifyDate: moment().format("MM-DD-YYYY") };

		if (req.file) {
			const filePath = req.file.path;
			const image = sharp(filePath);

			image
				.metadata()
				.then(metadata => {
					const { width, height } = metadata;

					if (width < 800 && height < 800) {
						copyFile(filePath, path.resolve(__dirname, "../build", filePath));
					} else if (width > height) {
						return image.resize(800).toFile(path.resolve(__dirname, "../build", filePath));
					} else {
						return image.resize(null, 800).toFile(path.resolve(__dirname, "../build", filePath));
					}
				})
				.then(() => {
					unlink(filePath);
				});

			updateData.picturePath = filePath;
		}

		ProductModel.findByIdAndUpdate(id, { $set: updateData })
			.select("picturePath -_id")
			.exec((err, product) => {
				if (product) {
					if (updateData.picturePath) {
						unlink(path.resolve(__dirname, "../build", product.picturePath));

						return res.send({ picturePath: updateData.picturePath });
					}

					res.send({ picturePath: product.picturePath });
				}
			});
	});
};
