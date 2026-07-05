module.exports.LoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "please login first");
    res.redirect("/login");
  }
  next();
};
