const listing = require("./models/listing.js");
const review = require("./models/review.js");
const Expresserror = require("./utils/customerror.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const isloggin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirect = req.originalUrl;
    console.log(req.session.redirect);
    req.flash("error", "please login first");
    return res.redirect("/login");
  }
  next();
};

const Redirect = (req, res, next) => {
  if (req.session.redirect) {
    res.locals.redirect = req.session.redirect;
  }
  next();
};
const isowner = async (req, res, next) => {
  const { id } = req.params;
  const data = await listing.findById(id);
  if (!res.locals.currUser._id.equals(data.owner._id)) {
    req.flash("error", " owner  has only access");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

const isReviewowner = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const data = await review.findById(reviewId);
  if (!res.locals.currUser._id.equals(data.author._id)) {
    req.flash("error", " owner  has only access");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

const validation = (req, res, next) => {
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
};

const validaterev = (req, res, next) => {
  console.log("Review route hit");
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((ele) => ele.message);
    throw new Expresserror(403, errmsg);
  } else {
    next();
  }
};
module.exports = {
  isloggin,
  Redirect,
  isowner,
  validation,
  validaterev,
  isReviewowner,
};
