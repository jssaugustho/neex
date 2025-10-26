// src/webhooks/stripe.ts
import { Request, Response } from "express";

import { TelegramUser as iTelegramUser } from "@prisma/client";
import Stripe from "stripe";
import Core from "../core/core.js";
import { iPaymentMetadata } from "packages/core/dist/core/StripePayments/StripePayments.js";
import { iTelegramBotPayload } from "packages/core/dist/core/TelegramBot/TelegramBot.js";

const stripe = new Stripe(process.env.STRIPE_KEY);

const { Logger, StripePayments, Prisma, Errors, Seller } = Core;

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
      const {
        accountId,
        leadId,
        paymentId,
        productId,
        telegramBotId,
        locale,
        currency,
        email,
      } = paymentIntent.metadata as iPaymentMetadata;

      const telegramBot = (await Prisma.telegramBot.findUniqueOrThrow({
        where: {
          id: telegramBotId,
        },
        include: {
          managementBot: true,
          account: true,
        },
      })) as iTelegramBotPayload;

      if (!telegramBot) {
        await Errors.notifyError(
          "telegramBot not found.",
          "WEBHOOK",
          {},
          telegramBot,
          {
            paymentId,
          },
        );

        return res.status(400).send(`Webhook Error: telegramBot not found.`);
      }

      const telegramUser = (await Prisma.telegramUser.findFirst({
        where: {
          lead: {
            id: leadId,
          },
        },
      })) as iTelegramUser;

      if (!telegramUser) {
        await Errors.notifyError(
          "telegramUser not found.",
          "WEBHOOK",
          {},
          telegramBot,
          {
            paymentId,
          },
        );

        return res.status(400).send(`Webhook Error: telegramUser not found.`);
      }

      await StripePayments.notifyPayment(
        accountId,
        leadId,
        paymentId,
        telegramBotId,
        telegramBot.groupId,
        telegramUser.chatId,
        telegramUser.messageId,
        locale,
        currency,
        email,
      ).catch(async (err) => {
        await Errors.notifyError(
          "Notify payment error.",
          "WEBHOOK",
          err,
          telegramBot,
          {
            paymentId,
            groupId: telegramBot.groupId,
            chatId: telegramUser.chatId,
            messageId: telegramUser.messageId,
          },
        );
      });

      Logger.info(
        {
          stripePaymentId: paymentIntent.id,
          leadId: leadId,
          paymentId: paymentId,
          product: productId,
          amount: paymentIntent.amount,
        },
        "Success payment intent notification.",
      );

      break;
    }

    case "account.updated": {
      const account = event.data.object as Stripe.Account;

      Logger.info(
        {
          account,
          type: "account.updated",
        },
        "Account updated.",
      );

      await Seller.updateSeller(
        account.id,
        account.details_submitted,
        account.charges_enabled,
        account.payouts_enabled,
      );

      break;
    }
  }

  // Stripe exige 200 OK
  return res.json({ received: true });
}

export default stripeWebhook;
