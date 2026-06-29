const express = require("express");
const router = express.Router({ mergeParams: true });
const review = require("../models/review.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Expresserror = require("../utils/customerror.js");
const wrapasync = require("../utils/wrapasync");
const listing = require("../models/listing.js");
function validaterev(req, res, next) {
  console.log("Review route hit");
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((ele) => ele.message);
    throw new Expresserror(403, errmsg);
  } else {
    next();
  }
}

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
  validaterev,
  wrapasync(async (req, res) => {
    let rev = req.body.review;
    let id = req.params.id;
    let newrev = new review(rev);
    await newrev.save();
    let Listing = await listing.findById(id);
    Listing.reviews.push(newrev);
    await Listing.save();
    res.redirect(`/listings/${id}`);
  }),
);
// deleet  route
router.delete(
  "/:reviewId",
  wrapasync(async (req, res) => {
    console.log("Review route hitvalidateeeeee");
    let { id, reviewId } = req.params;
    await review.findByIdAndDelete(reviewId);
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/listings/${id}`);
  }),
);
module.exports = router;
