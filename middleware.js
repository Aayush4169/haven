const LoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "please login first");
    return res.redirect("/login");
  }
  next();
};
module.exports = LoggedIn;
