import { Context, Markup } from "telegraf";
import t from "../libs/i18n.js";
import LeadContext from "../@types/context.js";
import { COUNTRIES, SUPPORTED_SLUGS } from "../libs/countries.js";

export default async function countryAction(ctx: Context): Promise<void> {
  const locale = ctx.state.locale;

  const countries = COUNTRIES.map((country) => {
    return [Markup.button.callback(country.uiName, `plans/${country.slug}`)];
  });

  await ctx.editMessageText(t(locale, "chooseCountry"), {
    reply_markup: Markup.inlineKeyboard(countries).reply_markup,
    parse_mode: "HTML",
  });
}
