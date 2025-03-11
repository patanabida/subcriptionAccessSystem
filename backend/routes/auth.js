const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const AuthRouter = express.Router();

// Register Route
AuthRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = new UserModel({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(400).json({ message: "Error registering user" });
  }
});

// Login Route
AuthRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ _id: user._id, subscriptionPlan: user.subscriptionPlan }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, subscriptionPlan: user.subscriptionPlan });
});

module.exports = AuthRouter;
