const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  subscriptionPlan: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    default: "Basic",
  },
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
