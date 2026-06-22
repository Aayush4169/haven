const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },

  created_At: {
    type: Date,
    Default: Date.now(),
  },
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
