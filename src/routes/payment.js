const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const stripe = require("../utils/stripe");

paymentRouter.post("/payment/createorder", userAuth, async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // $50 CAD
      currency: "cad",
      automatic_payment_methods: {
        enabled: true,
      },
      description: "DevTinder Gold Plan",
      metadata: {
        userId: req.user._id.toString(),
        plan: "Gold",
      },
    });

    return res.status(200).json({
      paymentIntent,
    });
  } catch (err) {
    console.error("Stripe error:", err);

    return res.status(500).json({
      message: "Payment initialization failed",
      error: err.message,
    });
  }
});

module.exports = paymentRouter;
