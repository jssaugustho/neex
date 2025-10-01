import { Telegraf } from "telegraf";
import Logger from "../Logger/Logger.js";
import Prisma from "../Prisma/Prisma.js";

import { iTelegramBotPayload } from "../TelegramBot/TelegramBot.js";
import { getMessage } from "../../locales/getMessage.js";

class Errors {
  formatErrorForTelegram(err: any, context?: string): string {
    const errorPayload = {
      context: context || null, // ex: notifyPayment, cron, etc.
      name: err?.name || "Error",
      message: err?.message || String(err),
      code: err?.code || null,
      meta: err?.meta || null,
      stack: err?.stack || null,
    };

    let text =
      "❌ <b>Erro capturado</b>" +
      (context ? ` em <b>${context}</b>` : "") +
      "\n\n<pre>" +
      JSON.stringify(errorPayload, null, 2) +
      "</pre>";

    // Limite de 4096 caracteres no Telegram
    if (text.length > 3096) {
      text =
        text.substring(0, 4000) + "\n\n… (cortado, mensagem muito longa)</pre>";
    }

    return text;
  }

  async notifyError(
    message: string,
    type: "WEBHOOK" | "BOT",
    err: any,
    botStarted?: iTelegramBotPayload,
    info?: object,
  ) {
    let data: any = {
      type,
      error: err,
      info,
    };

    if (botStarted)
      data.bot = {
        connect: {
          id: botStarted.id,
        },
      };

    const error = await Prisma.errorLogs.create({
      data,
    });

    if (botStarted) {
      const bot = new Telegraf(botStarted.managementBot.token);

      await bot.telegram.sendMessage(
        botStarted.managementBot.errorsGroupId,
        getMessage("telegramErrorNotification", "pt-br", {
          account: botStarted.account.name,
          botId: botStarted.id,
          error: this.formatErrorForTelegram(err, "WEBHOOK"),
        }),
        {
          parse_mode: "HTML",
        },
      );
    }

    Logger.error(error, message);
  }
}

export default new Errors();
