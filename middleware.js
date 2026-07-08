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
module.exports = { isloggin, Redirect };
