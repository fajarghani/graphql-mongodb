const Product = require('../models/product');
const User = require('../models/user');
const config = require('../config/keys');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require('../database/connection');

function getUserId(context) {
	const Authorization = context.request.get("Authorization");
	if (Authorization) {
		const token = Authorization.replace("Bearer ", "");
		const {
			userId
		} = jwt.verify(token, config.SECRET_KEY);
		return userId;
	}

	throw new Error("Not authenticated");
}

const resolver = {
	Query: {
		products: () => {
			return Product.find({}, (err, product) => product);
		}
	},
	Mutation: {
		addProduct: (parent, args, context, info) => {
			getUserId(context);
			args = JSON.parse(JSON.stringify(args));

			let obj = {
				date: new Date().toLocaleDateString(),
				name: args.name,
				alias: args.alias,
				type: args.type,
				description: args.description,
				price: args.price,
				stock: args.stock
			};

			const product = new Product(obj);
			return product.save().then(() => product);
		},
		updateProduct: (parent, args, context, info) => {
			getUserId(context);
			args = JSON.parse(JSON.stringify(args));

			let obj = {
				name,
				alias,
				type,
				description,
				price,
				stock
			} = args

			if (mongoose.Types.ObjectId.isValid(args.id)) {
				return Product.findByIdAndUpdate({
					_id: args.id
				}, obj, {
					new: true
				}, function (error, docs) {
					return docs;
				})
			} else {
				return "Pastikan ID benar";
			}
		},
		deleteProduct: (parent, args, context, info) => {
			getUserId(context);
			if (mongoose.Types.ObjectId.isValid(args.id)) {
				return Product.findOneAndRemove({
						_id: args.id
					})
					.then(docs => {
						if (docs) {
							return "Berhasil";
						} else {
							return "Data tidak ada";
						}
					})
					.catch(err => {
						return err;
					});
			} else {
				return "Pastikan ID benar";
			}
		},
		signup: async (parent, args, context, info) => {
			const password = await bcrypt.hash(args.password, 10);
			const user = await new User({
				...args,
				password
			});
			return user.save().then(() => {
				const token = jwt.sign({
					userId: user.id
				}, config.SECRET_KEY);
				return {
					token,
					user
				};
			});
		},
		login: async (parent, args, context, info) => {
			const user = await User.findOne({
				email: args.email
			});
			if (!user) {
				throw new Error("No such user found");
			}

			const valid = await bcrypt.compare(args.password, user.password);
			if (!valid) {
				throw new Error("Invalid password");
			}

			const token = jwt.sign({
				userId: user.id
			}, config.SECRET_KEY);

			return {
				token,
				user
			};
		}
	}
};

module.exports = resolver;