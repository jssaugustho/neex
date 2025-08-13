import { Context, Markup } from "telegraf";
import t from "../libs/i18n";

export default async function startAction(ctx: Context): Promise<void> {
  console.log("Iníciou bot.");
  await ctx.reply("Carregando vídeo...");
  await ctx.replyWithVideo(
    { source: process.env.VIDEO_URL! },
    {
      caption: t("pt", "cta-start-video"),
    },
  );
  await ctx.replyWithMarkdownV2(t("pt", "start"), {
    reply_markup: Markup.inlineKeyboard([
      [Markup.button.callback(t("pt", "cta-comprar"), "comprar")],
    ]).reply_markup,
  });
}
