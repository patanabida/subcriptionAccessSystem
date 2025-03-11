const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");

const SubscriptionRouter = express.Router();

// Update Subscription Plan
SubscriptionRouter.put("/subscribe", authMiddleware, async (req, res) => {
  const { subscriptionPlan } = req.body;
  if (!["Basic", "Standard", "Premium"].includes(subscriptionPlan)) {
    return res.status(400).json({ message: "Invalid plan" });
  }
  await User.findByIdAndUpdate(req.user._id, { subscriptionPlan });
  res.json({ message: "Subscription updated" });
});

// Get Content Based on Subscription
SubscriptionRouter.get("/content", authMiddleware, (req, res) => {
  const { subscriptionPlan } = req.user;
  const content = {
    Basic: "Basic Content",
    Standard: "Standard Content",
    Premium: "Premium Content",
  };
  res.json({ content: content[subscriptionPlan] });
});

module.exports = SubscriptionRouter;
