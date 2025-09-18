import { Context, Markup } from "telegraf";
import t from "../libs/i18n.js";
import StripePayments from "packages/core/src/core/StripePayments/StripePayments.js";
import NeexCore from "../libs/core.js";
import Lead from "packages/core/src/core/Lead/Lead.js";

import { Seller as iSeller } from "@prisma/client";
import LeadContext from "../@types/context.js";
import LeadState from "../@types/context.js";
import { currencies } from "../libs/currencies.js";
import config from "../libs/config.js";

const { Product, Logger } = NeexCore;

interface BotContext extends Context {
  match: RegExpExecArray;
}

export default async function stripe(ctx: BotContext) {
  const state = ctx.state as LeadState;

  const currency = ctx.match[1];

  if (!state.product) throw new Error("Select a product first");

  let locale = Object.keys(currencies).find(
    (locale) => currencies[locale].code === currency,
  ) as string;

  let currencyString = t(locale, `currencies.${currency}`);

  const paymentLink = await StripePayments.createPaymentLinkbyLead(
    t(locale, "defaultProductName"),
    ctx.state.product,
    ctx.state.lead,
    ctx.state.seller as iSeller,
    currency,
    locale,
    config.BOT_ID,
    ctx.state.lead.telegramUserId,
  );

  let price = await Product.getPriceByCurrency(state.product, currency);

  await ctx.editMessageText(
    t(locale, "paymentLinkDescription", {
      price: (price / 100).toFixed(2),
      currency: currencyString,
    }),
    {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.url(
            t(locale, "openPaymentLink"),
            paymentLink?.link || "#",
          ),
        ],
        [Markup.button.callback(t(locale, "back"), `plans/${currency}`)],
      ]).reply_markup,
      parse_mode: "HTML",
    },
  );
}
