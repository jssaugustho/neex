// src/webhooks/stripe.ts
import { Request, Response } from "express";

import {
  Prisma as iPrisma,
  TelegramBot as iTelegramBot,
  TelegramUser as iTelegramUser,
} from "@prisma/client";
import Neex from "@neex/core";
import Stripe from "stripe";
import TelegramBot from "packages/core/src/core/TelegramBot/TelegramBot.js";
import { iLeadPayload } from "packages/core/src/core/Lead/Lead.js";

const stripe = new Stripe(process.env.STRIPE_KEY);

const { Logger, StripePayments, Prisma } = Neex();

type iPaymentMetadata = {
  telegramBotId: string;
  telegramUserId: string;
  paymentId: string;
  productId: string;
  leadId: string;
  locale: string;
};

async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🎯 Tratamento dos eventos
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { leadId, paymentId, productId, telegramBotId, locale } =
        paymentIntent.metadata as iPaymentMetadata;

      Logger.info(
        {
          stripePaymentId: paymentIntent.id,
          leadId: leadId,
          paymentId: paymentId,
          product: productId,
          amount: paymentIntent.amount,
        },
        "✅ Pagamento confirmado:",
      );

      const telegramBot = (await Prisma.telegramBot
        .findUniqueOrThrow({
          where: {
            id: telegramBotId,
          },
        })
        .catch(() => {
          return res.status(400).send(`Webhook Error: telegramBot not found.`);
        })) as iTelegramBot;

      const telegramUser = (await Prisma.telegramUser
        .findFirst({
          where: {
            leadId: leadId,
          },
        })
        .catch(() => {
          return res.status(400).send(`Webhook Error: telegramUser not found.`);
        })) as iTelegramUser;

      await StripePayments.notifyPayment(
        paymentId,
        telegramBotId,
        telegramBot.groupId,
        telegramUser.chatId,
        telegramUser.messageId,
        locale,
      );

      break;
    }

    case "account.updated": {
      const account = event.data.object as Stripe.Account;

      console.log("ℹ️ Conta atualizada:", account.id);

      if (account.details_submitted) {
        console.log("📄 KYC enviado para:", account.id);
        // 👉 Atualizar DB: details_submitted = true
      }

      if (account.charges_enabled) {
        console.log("💳 Pagamentos habilitados para:", account.id);
        // 👉 Atualizar DB: charges_enabled = true
      }

      if (account.payouts_enabled) {
        console.log("💸 Payouts habilitados para:", account.id);
        // 👉 Atualizar DB: payouts_enabled = true
      }

      break;
    }
  }

  // Stripe exige 200 OK
  res.json({ received: true });
}

export default stripeWebhook;
