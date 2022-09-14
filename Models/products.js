const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    minLength: [3, "Name of product can not be less than 3 characters"],
    required: true,
    trim: true,
    capitalize: true,
  },
  price: {
    type: Number,
    required: true,
    min: [1, "Price can not be less than $1"],
    max: [10, "Price can not be more than $10"],
  },
  category: {
    required: true,
    type: String,
    enum: ["Vegetable", "Fruit", "Dairy", "Cereal"],
    capitalize: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
