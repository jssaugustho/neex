import { Lead as iLead, Prisma as iPrisma } from "@prisma/client";
import { Context, Markup } from "telegraf";
import t from "../libs/i18n.js";
import NeexCore from "../libs/core.js";
import LeadState from "../@types/context.js";
import { getCountryBySlug } from "../libs/countries.js";

const { Product, Logger } = NeexCore;

interface BotContext extends Context {
  match: RegExpExecArray;
}

export default async function planos(ctx: BotContext): Promise<void> {
  let state = ctx.state as LeadState;

  const slug = ctx.match[1];

  let localeInfo = getCountryBySlug(slug);

  let { language, uiName, currency, locale } = localeInfo;

  let products = await Product.listProducts(state.account);

  const response = await Promise.all(
    products.map(async (product) => {
      const price = await Product.getPriceByCurrency(product, currency);

      return [
        Markup.button.callback(
          t(locale, product.description, {
            price: (price / 100).toFixed(2),
          }),
          `methods/${slug}/${product.id}`,
        ),
      ];
    }),
  );

  await ctx.editMessageText(t(locale, "choosePlan", { country: uiName }), {
    reply_markup: Markup.inlineKeyboard([
      ...response,
      [
        Markup.button.callback(
          `${t(locale, "changeCountry")} / Change Country`,
          "country",
        ),
      ],
      [Markup.button.callback(t(locale, "back"), `consent/${slug}`)],
    ]).reply_markup,
    parse_mode: "HTML",
  });
}
