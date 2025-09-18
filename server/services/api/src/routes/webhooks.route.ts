import bodyParser from "body-parser";
// src/webhooks/stripe.ts
import express from "express";
import Stripe from "stripe";
import stripeWebhook from "../webhooks/stripe.webhook.js";

const webhooks = express.Router();

// 🚨 Importante: Stripe precisa do RAW body
webhooks.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook,
);

export default webhooks;
