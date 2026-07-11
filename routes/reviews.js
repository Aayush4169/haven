const express = require("express");
const router = express.Router({ mergeParams: true });
const review = require("../models/review.js");

const wrapasync = require("../utils/wrapasync");
const listing = require("../models/listing.js");
const { validaterev, isloggin, isReviewowner } = require("../middleware.js");

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

// vreatin routes for reviewssss

router.post(
  "/",
  isloggin,
  validaterev,
  wrapasync(async (req, res) => {
    let rev = req.body.review;
    let id = req.params.id;
    let newrev = new review(rev);
    newrev.author = req.user._id;
    await newrev.save();
    let Listing = await listing.findById(id);
    Listing.reviews.push(newrev);
    await Listing.save();
    req.flash("sucess", "review is created  succesfull");
    res.redirect(`/listings/${id}`);
  }),
);
// deleet  route
router.delete(
  "/:reviewId",
  isloggin,
  isReviewowner,
  wrapasync(async (req, res) => {
    console.log("Review route hitvalidateeeeee");
    let { id, reviewId } = req.params;
    await review.findByIdAndDelete(reviewId);
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("sucess", "riview is deleted  succesfull");
    res.redirect(`/listings/${id}`);
  }),
);
module.exports = router;
