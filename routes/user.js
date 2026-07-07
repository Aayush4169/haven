const express = require("express");
const router = express.Router({ mergeParams: true });
const user = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post(
  "/signup",
  wrapasync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new user({ email, username });
      let newregister = await user.register(newuser, password);
      console.log(newregister);
      req.login(newregister, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("sucess", "user register succesfully");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("sucess", "user login sucessfull");
    res.redirect("/listings");
  },
);

// logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("sucess", "user logout successfully");
    res.redirect("/listings");
  });
});
module.exports = router;
