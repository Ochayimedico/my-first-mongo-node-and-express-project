const express = require("express");
const methodOverride = require("method-override");
const { productSchema } = require("./joiSchema");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
const Product = require("./Models/products");

const app = express();

main().catch((err) => {
  console.log("MONGO CONNECTION ERROR");
  console.log(err);
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1/Shop");
  console.log("WE'RE CONNECTED TO MONGO");
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const joiValidation = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
// const categories = ["vegetable", "fruit", "dairy", "cereal"]

app.get("/products", async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.render("products/index", { products });
  } catch (e) {
    next(e);
  }
});
app.get("/products/new", (req, res) => {
  res.render("products/new");
});

app.post("/products", joiValidation, async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    // console.log(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
  } catch (e) {
    next(e);
  }
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/id", { product });
});
app.get("/products/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/edit", { product });
  } catch (e) {
    next(e);
  }
});
app.put("/products/:id", joiValidation, async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/products/${product._id}`);
  } catch (e) {
    next(e);
  }
});
app.delete("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect(`/products`);
  } catch (e) {
    next(e);
  }
});

app.all("*", (req, res) => {
  res.status(404).render("products/error");
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(500).render("products/error2", { err });
});

app.listen(4000, () => {
  console.log("CONNECTED TO EXPRESS ON PORT 4000");
});
