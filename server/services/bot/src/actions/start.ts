import { Context, Markup } from "telegraf";
import t from "../libs/i18n.js";
import NeexCore from "../libs/core.js";
import LeadState from "../@types/context.js";

const { Logger, TelegramUser } = NeexCore;

export default async function startAction(ctx: Context): Promise<void> {
  const state = ctx.state as LeadState;

  await ctx.reply(t(state.locale, "waitVideo"));

  Logger.info(
    {
      requestId: state.requestId,
      action: "start",
      telegramId: state.telegramId,
      locale: state.locale,
    },
    `Lead starting bot...`,
  );

  await ctx.replyWithVideo(state.telegramBot.videoUrl);

  const message = await ctx.replyWithHTML(t(state.locale, "start"), {
    reply_markup: Markup.inlineKeyboard([
      [
        Markup.button.callback(
          t(state.locale, "legalAge"),
          `plans/${state.slug}`,
        ),
      ],
      [
        Markup.button.callback(
          `${t(state.locale, "changeCountry")} / Change Country`,
          "country",
        ),
      ],
    ]).reply_markup,
  });

  ctx.state.telegramUser = await TelegramUser.setMessage(
    ctx.state.telegramId,
    message.chat.id,
    message.message_id,
  );

  Logger.info(
    {
      requestId: state.requestId,
      action: "start",
      telegramId: state.telegramId,
      locale: state.locale,
    },
    "Success start bot.",
  );
}
