import { Context, Markup } from "telegraf";
import t from "../libs/i18n.js";
import NeexCore from "../libs/core.js";
import LeadState from "../@types/context.js";
import { getCountryBySlug } from "../libs/countries.js";

const { Logger, TelegramUser } = NeexCore;

interface BotContext extends Context {
  match: RegExpExecArray;
}

export default async function consentMessage(ctx: BotContext): Promise<void> {
  const slug = ctx.match[1];

  let localeInfo = getCountryBySlug(slug);

  let { language, uiName, currency, locale, currencyName, paymentMethods } =
    localeInfo;

  await ctx.editMessageText(t(locale, "start"), {
    reply_markup: Markup.inlineKeyboard([
      [Markup.button.callback(t(locale, "legalAge"), `plans/${slug}`)],
      [
        Markup.button.callback(
          `${t(locale, "changeCountry")} / Change Country`,
          "country",
        ),
      ],
    ]).reply_markup,
    parse_mode: "HTML",
  });
}
