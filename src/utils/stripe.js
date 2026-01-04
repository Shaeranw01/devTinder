const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});
console.log("Stripe instance keys:", Object.keys(stripe));
module.exports = stripe;
