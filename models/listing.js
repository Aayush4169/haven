const mongoose = require("mongoose");
const ListingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://unsplash.com/photos/wildflower-meadow-with-a-lush-green-forest-under-blue-sky-Zz1DmaAD_Qs",
    set: (v) =>
      v === ""
        ? "https://unsplash.com/photos/wildflower-meadow-with-a-lush-green-forest-under-blue-sky-Zz1DmaAD_Qs"
        : v,
  },
  price: {
    type: Number,
  },

  location: {
    type: String,
    required: true,
  },

  country: {
    type: String,
  },
});

const listing = mongoose.model("listing", ListingSchema);
module.exports = listing;
