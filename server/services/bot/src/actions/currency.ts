import { Context, Markup } from "telegraf";
import t from "../libs/i18n.js";
import LeadContext from "../@types/context.js";

export default async function currencyAction(ctx: Context): Promise<void> {
  const locale = ctx.state.locale;

  await ctx.editMessageText(t(locale, "chooseCurrency"), {
    reply_markup: Markup.inlineKeyboard([
      [Markup.button.callback(t(locale, "currencies.brl"), "plans/brl")],
      [Markup.button.callback(t(locale, "currencies.usd"), "plans/usd")],
      [Markup.button.callback(t(locale, "currencies.eur"), "plans/eur")],
    ]).reply_markup,
    parse_mode: "HTML",
  });
}
