const mongoose = require("mongoose");
const UserSchema = require("./schemas/user.ts");

exports.User = mongoose.model("User", UserSchema);
