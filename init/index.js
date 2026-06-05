const listing = require("../models/listing");
const initdata = require("./data.js");
const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/haven");
}

main()
  .then(() => {
    console.log("connected to Mongo DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async function () {
  await listing.deleteMany({});
  await listing.insertMany(initdata.data);
  console.log("data is initialized");
};

initDB();
