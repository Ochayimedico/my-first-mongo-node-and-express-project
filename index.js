const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const productsRoute = require("./routes/productsRoute");

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
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ secret: "thisisasecret", resave: false, saveUninitialized: true })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});

app.use("/products", productsRoute);

app.all("*", (req, res) => {
  res.status(404).render("products/error");
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  // console.log(err);
  res.status(500).render("products/error2", { err });
});

app.listen(4000, () => {
  console.log("CONNECTED TO EXPRESS ON PORT 4000");
});
