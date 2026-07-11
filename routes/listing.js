const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapasync");

const { isloggin, isowner, validation } = require("../middleware.js");

// index route showing all the data
router.get(
  "/",
  wrapasync(async (req, res) => {
    const data = await listing.find();

    res.render("listing/index.ejs", { data });
  }),
);
// add new listing route

router.get("/new", isloggin, (req, res) => {
  res.render("listing/new.ejs");
});
// create  Route
router.post(
  "/",
  isloggin,
  validation,
  wrapasync(async (req, res, next) => {
    const data = req.body.listing;

    let newdata = new listing(data);
    newdata.owner = req.user._id;
    await newdata.save();

    req.flash("sucess", "listing is added successfully");
    res.redirect("/listings");
  }),
);
// edit render the page
router.get(
  "/:id/edit",
  isloggin,
  isowner,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id);

    res.render("listing/edit.ejs", { data });
  }),
);
// put method to update the data
router.put(
  "/:id",
  isloggin,
  isowner,
  validation,

  wrapasync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("sucess", "editing is  succesfull");
    res.redirect(`/listings/${id}`);
  }),
);
// delete route
router.delete(
  "/:id",
  isloggin,
  isowner,
  wrapasync(async (req, res) => {
    console.log("delete route hit ittt");
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("sucess", "listing is deleted  succesfull");
    res.redirect("/listings");
  }),
);
//  show routeee
router.get(
  "/:id",
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let data = await listing
      .findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!data) {
      req.flash("error", "listing is not available");
      return res.redirect("/listings");
    }
    res.render("listing/show.ejs", { data });
  }),
);

module.exports = router;
