const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

console.log("Type:", typeof passportLocalMongoose);
console.log(passportLocalMongoose);

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
