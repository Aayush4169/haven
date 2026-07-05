const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const path = require("path");
const methodOverride = require("method-override");
const { runInNewContext } = require("vm");
const ejsMate = require("ejs-mate");
const Expresserror = require("./utils/customerror.js");
// this  is join for validation
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
const sessionoption = {
  secret: "keyword",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionoption));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/haven");
}

//  validation function for joi that pacjage we define  it check the listing and its propertiess are available or not

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
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  next();
});
app.get("/demouser", async (req, res, next) => {
  const fakseuser = new User({
    email: "student@gmail.com",
    username: "fakeuser",
  });
  const registeruser = await User.register(fakseuser, "helloworld");
  res.send(registeruser);
});
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter);
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
