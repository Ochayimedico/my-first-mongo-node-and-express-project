const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const { productSchema } = require("../joiSchema");
const ExpressError = require("../utils/ExpressError");

const joiValidation = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    // console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const categories = ["Vegetable", "Fruit", "Dairy", "Cereal"];

router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.render("products/index", { products });
  } catch (e) {
    next(e);
  }
});

router.get("/new", (req, res) => {
  res.render("products/new", { categories });
});

router.post("/", joiValidation, async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    req.flash(
      "success",
      `Successfully Added a New Product - ${newProduct.name}`
    );
    res.redirect(`/products/${newProduct._id}`);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/id", { product });
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/edit", { product, categories });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", joiValidation, async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    const editedProduct = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    req.flash(
      "success",
      `Successfully Edited Product From ${product.name} to ${editedProduct.name}`
    );
    res.redirect(`/products/${editedProduct._id}`);
  } catch (e) {
    next(e);
  }
});
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);
    req.flash(
      "success",
      `Successfully Deleted the Product- ${deletedProduct.name}`
    );
    res.redirect(`/products`);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
