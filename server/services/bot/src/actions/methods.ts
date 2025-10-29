import { InlineKeyboardButton } from "@telegraf/types/markup.js";
import { Lead as iLead } from "@prisma/client";
import { Context, Markup } from "telegraf";
import t, { SupportedLocales } from "../libs/i18n.js";
import NeexCore from "../libs/core.js";
import { iProductPayload } from "@neex/core/src/core/Product/Product.js";
import LeadState from "../@types/context.js";
import { getCountryByLocale, getCountryBySlug } from "../libs/countries.js";

const { Lead, Logger, Prisma, Product } = NeexCore;

interface BotContext extends Context {
  match: RegExpExecArray;
}

export default async function methods(ctx: BotContext): Promise<void> {
  const state = ctx.state as LeadState;

  const slug = ctx.match[1];
  const productId = ctx.match[2];

  let localeInfo = getCountryBySlug(slug);

  let { language, uiName, currency, locale, currencyName, paymentMethods } =
    localeInfo;

  Logger.info(
    {
      productId,
      requestId: state.requestId,
      leadId: state.lead.id,
      currency: currency,
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

  function getStripeButton(
    locale: SupportedLocales,
    slug: string,
    productId: string,
  ) {
    return [
      Markup.button.callback(
        t(locale, "stripe"),
        `stripe/${slug}/${productId}`,
      ),
    ];
  }

  function getPixButton(
    locale: SupportedLocales,
    slug: string,
    productId: string,
  ) {
    return [
      Markup.button.callback(t(locale, "pix"), `pix/${slug}/${productId}`),
    ];
  }

  let response: any[] = paymentMethods.map((method) => {
    if (method.slug === "stripe")
      return getStripeButton(locale, slug, productId);

    if (method.slug === "pix") return getPixButton(locale, slug, productId);
  });

  await ctx.editMessageText(
    t(locale, "chooseMethod", {
      currency: currencyName,
      price: (price / 100).toFixed(2),
    }),
    {
      reply_markup: Markup.inlineKeyboard([
        ...response,
        [Markup.button.callback(t(locale, "back"), `plans/${slug}`)],
      ]).reply_markup,
      parse_mode: "HTML",
    },
  );
}
