const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const { runInNewContext } = require("vm");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

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
app.get("/listings", async (req, res) => {
  const data = await listing.find();

  res.render("listing/index.ejs", { data });
});
// add new listing route

app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});
app.post("/listings", async (req, res) => {
  const data = req.body.listing;

  let newdata = new listing(data);

  await newdata.save();
  res.redirect("/listings");
});
// edit render the page
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let data = await listing.findById(id);
  res.render("listing/edit.ejs", { data });
});
// put method to update the data
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect("/listings");
});
// delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
//  show routeee
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let data = await listing.findById(id);
  res.render("listing/show.ejs", { data });
});
app.listen("3000", () => {
  console.log("app is listening on port 3000");
});
