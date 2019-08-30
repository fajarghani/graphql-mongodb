const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
	date: {
		type: String
	},
	name: {
		type: String
	},
	alias: {
		type: String
	},
	type: {
		type: String
	},
	description: {
		type: String
	},
	price: {
		type: Number
	},
	stock: {
		type: Number
	}
});

module.exports = mongoose.model('Product', productSchema);