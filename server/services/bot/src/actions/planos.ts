import { Lead as iLead, Prisma as iPrisma } from "@prisma/client";
import { Context, Markup } from "telegraf";
import t from "../libs/i18n.js";
import NeexCore from "../libs/core.js";
import LeadState from "../@types/context.js";
import { currencies } from "../libs/currencies.js";

const { Product, Logger } = NeexCore;

interface BotContext extends Context {
  match: RegExpExecArray;
}

export default async function planos(ctx: BotContext): Promise<void> {
  let state = ctx.state as LeadState;

  const currency = ctx.match[1];

  let locale = Object.keys(currencies).find(
    (locale) => currencies[locale].code === currency,
  ) as string;

  let products = await Product.listProducts(state.account);
  let currencyString = t(locale, `currencies.${currency}`);

  const response = await Promise.all(
    products.map(async (product) => {
      const price = await Product.getPriceByCurrency(product, currency);

      return [
        Markup.button.callback(
          t(locale, product.description, {
            price: (price / 100).toFixed(2),
          }),
          `methods/${currency}/${product.id}`,
        ),
      ];
    }),
  );

  await ctx.editMessageText(
    t(locale, "choosePlan", { currency: currencyString }),
    {
      reply_markup: Markup.inlineKeyboard([
        ...response,
        [Markup.button.callback(t(locale, "changeCurrency"), "currency")],
      ]).reply_markup,
      parse_mode: "HTML",
    },
  );
}
