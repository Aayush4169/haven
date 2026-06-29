const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const { runInNewContext } = require("vm");
const ejsMate = require("ejs-mate");
const Expresserror = require("./utils/customerror.js");
// this  is join for validation
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/haven");
}

//  validation function for joi that pacjage we define  it check the listing and its propertiess are available or not

main()
  .then(() => {
    console.log("connected to Mongo DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("this is root directory");
});
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("/*splat", (req, res, next) => {
  next(new Expresserror(404, "page not found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong" } = err;
  res.status(status).render("listing/error.ejs", { err });
});
app.listen("3000", () => {
  console.log("app is listening on port 3000");
});
