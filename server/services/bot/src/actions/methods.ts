import { InlineKeyboardButton } from "@telegraf/types/markup.js";
import { Lead as iLead } from "@prisma/client";
import { Context, Markup } from "telegraf";
import t, { SupportedLocales } from "../libs/i18n.js";
import NeexCore from "../libs/core.js";
import Product, {
  iProductPayload,
} from "packages/core/src/core/Product/Product.js";
import LeadState from "../@types/context.js";
import { currencies } from "../libs/currencies.js";

const { Lead, Logger, Prisma } = NeexCore;

interface BotContext extends Context {
  match: RegExpExecArray;
}

export default async function methods(ctx: BotContext): Promise<void> {
  const state = ctx.state as LeadState;

  const currency = ctx.match[1] as "usd" | "eur" | "brl";
  const productId = ctx.match[2];

  let locale = Object.keys(currencies).find(
    (locale) => currencies[locale].code === currency,
  ) as string;

  if (!productId || !currency) {
    ctx.editMessageText(t(state.locale, "routeError"), {
      reply_markup: Markup.inlineKeyboard([
        [Markup.button.callback(t(state.locale, "back"), `plans/${currency}`)],
      ]).reply_markup,
      parse_mode: "HTML",
    });
    return;
  }

  Logger.info(
    {
      productId,
      requestId: state.requestId,
      leadId: state.lead.id,
      currency,
    },
    "User set the plan.",
  );

  const product = (await Prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      prices: true,
    },
  })) as iProductPayload;

  let price = await Product.getPriceByCurrency(product, currency);

  ctx.state.lead = await Lead.setPlan(state.lead.id, productId);

  function getStripeButton(locale: SupportedLocales, currency: string) {
    return [
      [
        Markup.button.callback(
          t(locale, "stripe"),
          `stripe/${currency}/${productId}`,
        ),
      ],
    ];
  }

  let response: any = getStripeButton(locale, currency);

  let currencyString = t(locale, `currencies.${currency}`);

  await ctx.editMessageText(
    t(locale, "chooseMethod", {
      currency: currencyString,
      price: (price / 100).toFixed(2),
    }),
    {
      reply_markup: Markup.inlineKeyboard([
        ...response,
        [Markup.button.callback(t(locale, "back"), `plans/${currency}`)],
      ]).reply_markup,
      parse_mode: "HTML",
    },
  );
}
