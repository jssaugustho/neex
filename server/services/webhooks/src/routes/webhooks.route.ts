// src/webhooks/stripe.ts
import express from "express";

import stripeWebhook from "../webhooks/stripe.webhook.js";

const webhooks = express.Router();

// 🚨 Importante: Stripe precisa do RAW body
webhooks.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

export default webhooks;
