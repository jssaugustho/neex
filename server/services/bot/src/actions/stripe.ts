import { Context, Markup } from "telegraf";
import t from "../libs/i18n.js";
import NeexCore from "../libs/core.js";

import { Seller as iSeller } from "@prisma/client";
import LeadContext from "../@types/context.js";
import LeadState from "../@types/context.js";
import { getCountryBySlug } from "../libs/countries.js";
import { iProductPayload } from "packages/core/src/core/Product/Product.js";

const { Product, StripePayments, Prisma } = NeexCore;

interface BotContext extends Context {
  match: RegExpExecArray;
}

export default async function stripe(ctx: BotContext) {
  const state = ctx.state as LeadState;

  const slug = ctx.match[1];

  let localeInfo = getCountryBySlug(slug);

  let { language, uiName, currency, locale, currencyName } = localeInfo;

  const productId = ctx.match[2];

  const product = (await Prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      prices: true,
    },
  })) as iProductPayload;

  if (!product) throw new Error("Select a product first");

  const paymentLink = await StripePayments.createPaymentLinkbyLead(
    t(locale, "defaultProductName"),
    product,
    ctx.state.lead,
    ctx.state.seller as iSeller,
    currency,
    locale,
    slug,
    state.telegramBot.id,
    state.lead.telegramUserId,
    state.user.email,
  );

  let price = await Product.getPriceByCurrency(product, currency);

  await ctx.editMessageText(
    t(locale, "paymentLinkDescription", {
      price: (price / 100).toFixed(2),
      currency: currencyName,
    }),
    {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.url(
            t(locale, "openPaymentLink"),
            paymentLink?.link || "#",
          ),
        ],
        [Markup.button.callback(t(locale, "back"), `plans/${slug}`)],
      ]).reply_markup,
      parse_mode: "HTML",
    },
  );
}
