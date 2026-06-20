const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const { runInNewContext } = require("vm");
const ejsMate = require("ejs-mate");
const wrapasync = require("./utils/wrapasync");
const Expresserror = require("./utils/customerror.js");
const listingSchema = require("./schema.js"); // this  is join for validation

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

function validation(req, res, next) {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const errmsg = error.details
      .map((ele) => {
        return ele.message;
      })
      .join(",");
    throw new Expresserror(403, errmsg);
  } else {
    next();
  }
}
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

// llisting routing

// app.get("/listing", async (req, res) => {
//   let sampletesting = new listing({
//     title: "my house",
//     description: "sweat home",
//     price: "1500",
//     location: "barwani , Indore",
//     country: "India",
//   });
//   await sampletesting.save();
//   console.log("sample was save ");
//   res.send("done");
// });

// index route showing all the data
app.get(
  "/listings",
  wrapasync(async (req, res) => {
    const data = await listing.find();

    res.render("listing/index.ejs", { data });
  }),
);
// add new listing route

app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});
// create  Route
app.post(
  "/listings",
  validation,
  wrapasync(async (req, res, next) => {
    const result = listingSchema.validate(req.body);

    console.log(req.body.listing);
    const data = req.body.listing;

    let newdata = new listing(data);

    await newdata.save();
    res.redirect("/listings");
  }),
);
// edit render the page
app.get(
  "/listings/:id/edit",
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    res.render("listing/edit.ejs", { data });
  }),
);
// put method to update the data
app.put(
  "/listings/:id",
  validation,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }),
);
// delete route
app.delete(
  "/listings/:id",
  wrapasync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);
//  show routeee
app.get(
  "/listings/:id",
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    res.render("listing/show.ejs", { data });
  }),
);
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
