import { Context, Markup } from "telegraf";
import t from "../libs/i18n";

export default async function planosAction(ctx: Context): Promise<void> {
  const locale = "pt";
  await ctx.editMessageText(t(locale, "choose_plan"), {
    reply_markup: Markup.inlineKeyboard([
      [
        Markup.button.callback(
          t(locale, "plans.daily", { price: process.env.PRICE_DAILY }),
          "plan_daily",
        ),
      ],
      [
        Markup.button.callback(
          t(locale, "plans.weekly", { price: process.env.PRICE_WEEKLY }),
          "plan_weekly",
        ),
      ],
      [
        Markup.button.callback(
          t(locale, "plans.monthly", { price: process.env.PRICE_MONTHLY }),
          "plan_monthly",
        ),
      ],
      [
        Markup.button.callback(
          t(locale, "plans.quarterly", { price: process.env.PRICE_QUARTERLY }),
          "plan_quarterly",
        ),
      ],
      [Markup.button.callback(t(locale, "back"), "start")],
    ]).reply_markup,
  });
}
