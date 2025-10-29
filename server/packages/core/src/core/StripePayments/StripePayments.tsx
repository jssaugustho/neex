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
import { iTelegramBotPayload } from "../TelegramBot/TelegramBot.js";
import ManagementBot from "../ManagementBot/ManagementBot.js";
import { iAccountPayload } from "../Account/Account.js";
import { computeExpiryUTC } from "../../lib/Date.js";

const stripe = new Stripe(process.env.STRIPE_KEY);

export type iStripePayment = iPrisma.StripePaymentGetPayload<{
  include: {
    lead: true;
    product: true;
  };
}>;

export type iPaymentMetadata = {
  accountId: string;
  sellerId: string;
  telegramBotId: string;
  telegramUserId: string;
  paymentId: string;
  productId: string;
  leadId: string;
  locale: string;
  currency: string;
  email: string;
  slug: string;
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
    slug: string,
    telegramBotId: string,
    telegramUserId: string,
    email: string,
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
      accountId: seller.accountId,
      sellerId: seller.id,
      paymentId: stripePayment.id,
      productId: stripePayment.product.id,
      leadId: stripePayment.lead.id,
      telegramBotId: telegramBotId,
      telegramUserId: telegramUserId,
      locale,
      slug,
      currency,
      email,
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
      success_url: "https://neex.club/",
      cancel_url: "https://neex.club/support",
      expires_at: expiresIn,
      locale: locale as Stripe.Checkout.Session.Locale,
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
    accountId: string,
    leadId: string,
    paymentId: string,
    telegramBotId: string,
    groupId: number,
    chatId: number,
    messageId: number,
    locale: string,
    slug: string,
    currency: string,
    email: string,
  ) {
    const account = (await Prisma.account.findUnique({
      where: {
        id: accountId,
      },
      include: {
        products: true,
        user: true,
      },
    })) as iAccountPayload;

    const payment = await Prisma.stripePayment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: "SUCCESS",
      },
    });

    const product = (await Prisma.product.findUnique({
      where: {
        id: payment.productId,
      },
      include: {
        prices: true,
      },
    })) as iProductPayload;

    const price = await Product.getPriceByCurrency(product, currency);

    const telegramBot = (await Prisma.telegramBot.findUnique({
      where: {
        id: telegramBotId,
      },
      include: {
        managementBot: true,
      },
    })) as iTelegramBotPayload;

    const lead = await Prisma.lead.update({
      where: {
        id: leadId,
      },
      data: {
        status: "ACTIVE",
        expiresAt: computeExpiryUTC(new Date(), product.period, 1),
      },
    });

    await TelegramUser.sendGroupLink(
      telegramBotId,
      groupId,
      telegramBot?.managementBot.notificationsGroupId,
      telegramBot.notificationsGroupId,
      chatId,
      messageId,
      locale,
      slug,
      currency,
      price,
      email,
    );

    await ManagementBot.notificateTelegram(
      account,
      telegramBotId,
      telegramBot?.managementBot.notificationsGroupId,
      telegramBot.notificationsGroupId,
      locale,
      slug,
      currency,
      price,
      email,
    );
  }
}

export default new StripePayments();
