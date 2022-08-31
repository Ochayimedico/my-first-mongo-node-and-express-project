const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, minLength: 3, required: true },
  price: {
    type: Number,
    required: true,
    min: [1, "Price must not be less than $1"],
    max: [5, "Price must not be more than $5"],
  },

  category: {
    // required: true,
    type: String,
    enum: ["vegetable", "fruit", "dairy", "cereal"],
    lowercase: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
