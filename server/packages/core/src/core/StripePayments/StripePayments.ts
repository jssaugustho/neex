import Stripe from "stripe";

import {
  Prisma as iPrisma,
  TelegramUser as iTelegramUser,
  Seller as iSeller,
} from "@prisma/client";
import Prisma from "../Prisma/Prisma.js";
import Product, { iProductPayload } from "../Product/Product.js";
import { iLeadPayload } from "../Lead/Lead.js";
import TelegramUser from "../TelegramUser/TelegramUser.js";

const stripe = new Stripe(process.env.STRIPE_KEY);

export type iStripePayment = iPrisma.StripePaymentGetPayload<{
  include: {
    lead: true;
    product: true;
  };
}>;

type iPaymentMetadata = {
  telegramBotId: string;
  telegramUserId: string;
  paymentId: string;
  productId: string;
  leadId: string;
  locale: string;
  currency: string;
};

class StripePayments {
  async createAccount(email: string): Promise<Stripe.Response<Stripe.Account>> {
    const account = await stripe.accounts.create(
      {
        type: "standard",
        country: "BR",
        email,
        capabilities: {
          transfers: {
            requested: true,
          },
          card_payments: {
            requested: true,
          },
        },
      },
      { apiVersion: "2022-08-01" },
    );

    return account;
  }

  async getOnboardingLink(
    accountId: string,
  ): Promise<Stripe.Response<Stripe.AccountLink>> {
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: "https://neex.club/refresh",
      return_url: "https://neex.club/return",
      type: "account_onboarding",
    });

    return link;
  }

  async createPaymentLinkbyLead(
    name: string,
    product: iProductPayload,
    lead: iLeadPayload,
    seller: iSeller,
    currency: string,
    locale: string,
    telegramBotId: string,
    telegramUserId: string,
  ): Promise<iStripePayment> {
    let unit_amount = await Product.getPriceByCurrency(product, currency);

    const expiresIn = Math.floor(Date.now() / 1000) + 3600 * 24;

    let stripePayment = await Prisma.stripePayment.create({
      data: {
        expiresIn,
        product: {
          connect: {
            id: product.id,
          },
        },
        status: "PENDING",
        lead: {
          connect: {
            id: lead.id,
          },
        },
      },
      include: {
        lead: true,
        product: true,
      },
    });

    let metadata: iPaymentMetadata = {
      paymentId: stripePayment.id,
      productId: stripePayment.product.id,
      leadId: stripePayment.lead.id,
      telegramBotId: telegramBotId,
      telegramUserId: telegramUserId,
      locale,
      currency,
    };

    const link = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name,
            },
            unit_amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.round(unit_amount * seller.platformFee),
        transfer_data: {
          destination: seller.stripeId,
        },
        metadata,
      },
      payment_method_types: ["card"],
      mode: "payment",
      success_url: process.env.BOT_URL,
      cancel_url: process.env.BOT_URL,
      expires_at: expiresIn,
    });

    stripePayment = await Prisma.stripePayment.update({
      where: {
        id: stripePayment.id,
      },
      data: {
        link: link.url,
      },
      include: {
        lead: true,
        product: true,
      },
    });

    return stripePayment;
  }

  async notifyPayment(
    paymentId: string,
    telegramBotId: string,
    groupId: number,
    chatId: number,
    messageId: number,
    locale: string,
    currency: string,
  ) {
    await Prisma.stripePayment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: "SUCCESS",
      },
    });

    await TelegramUser.sendGroupLink(
      telegramBotId,
      groupId,
      chatId,
      messageId,
      locale,
      currency,
    );
  }
}

export default new StripePayments();
