const express = require("express");
const app = express();

const session = require("express-session");

app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: true }),
);
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
  res.redirect("/hello");
});
app.get("/hello", (req, res) => {
  console.log(req.session.name);
  res.send(`hello ${req.session.name}`);
});
app.listen("3000", () => {
  console.log("app is listening on port 3000");
});
