const express = require("express");
const app = express();
const path = require("path");

const session = require("express-session");
const flash = require("connect-flash");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/view"));

app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: true }),
);
app.use(flash());
app.get("/", (req, res) => {
  console.log("hello");
  res.send("rooot");
});
// app.get("/countreq", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   console.log(req.session.username);
//   res.send(`the count is ${req.session.count}`);
// });
app.get("/register", (req, res) => {
  let { name = "anonouymous" } = req.query;
  req.session.name = name;
  req.flash("sucess", "user login successfullyy");
  res.redirect("/hello");
});
app.get("/hello", (req, res) => {
  console.log(req.session.name);
  res.render("page.ejs", {
    name: req.session.name,
    msg: req.flash("sucess"),
  });
});
app.listen("3000", () => {
  console.log("app is listening on port 3000");
});
