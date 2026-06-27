const express = require("express");
const router = express.Router();
const listing = require("./models/listing.js");
const wrapasync = require("./utils/wrapasync");
const Expresserror = require("./utils/customerror.js");
const { listingSchema, reviewSchema } = require("./schema.js");

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
// index route showing all the data
router.get(
  "/listings",
  wrapasync(async (req, res) => {
    const data = await listing.find();

    res.render("listing/index.ejs", { data });
  }),
);
// add new listing route

router.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});
// create  Route
router.post(
  "/listings",
  validation,
  wrapasync(async (req, res, next) => {
    const data = req.body.listing;

    let newdata = new listing(data);

    await newdata.save();
    res.redirect("/listings");
  }),
);
// edit render the page
router.get(
  "/listings/:id/edit",
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    res.render("listing/edit.ejs", { data });
  }),
);
// put method to update the data
router.put(
  "/listings/:id",
  validation,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }),
);
// delete route
router.delete(
  "/listings/:id",
  wrapasync(async (req, res) => {
    console.log("delete route hit ittt");
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);
//  show routeee
router.get(
  "/listings/:id",
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { data });
  }),
);

module.exports = router;
