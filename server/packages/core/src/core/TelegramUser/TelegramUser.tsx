import {
  Prisma as iPrisma,
  TelegramUser as iTelegramUser,
  TelegramBot as iTelegramBot,
  Lead as iLead,
} from "@prisma/client";
import Prisma from "../Prisma/Prisma.js";
import Logger from "../Logger/Logger.js";

import { Markup, Telegraf } from "telegraf";
import { getMessage } from "../../locales/getMessage.js";
import { iTelegramBotPayload } from "../TelegramBot/TelegramBot.js";
import { iStripePayment } from "../StripePayments/StripePayments.js";

export type iLeadPayload = iPrisma.LeadGetPayload<{
  include: { telegramUser: true; product: true };
}>;

class TelegramUser {
  async upsert(
    telegramId: string,
    language: string,
    username: string,
    requestId: string,
    privateGroupId: number,
    messageId: number,
  ): Promise<iTelegramUser> {
    return new Promise(async (resolve, reject) => {
      Logger.info(
        {
          action: "start",
          requestId,
          telegramId,
          language,
          username,
        },
        `Upserting Telegram user...`,
      );

      let telegramUser = await Prisma.telegramUser.findUnique({
        where: {
          telegramId,
        },
      });

      if (!telegramUser)
        telegramUser = await Prisma.telegramUser.create({
          data: {
            language,
            telegramId,
            username,
            chatId: privateGroupId,
            messageId,
          },
        });

      resolve(telegramUser);
    });
  }

  async setMessage(telegramId: string, chatId: number, messageId: number) {
    return await Prisma.telegramUser.update({
      where: {
        telegramId,
      },
      data: {
        chatId: chatId,
        messageId,
      },
    });
  }

  async sendGroupLink(
    botId: string,
    privateGroupId: number,
    notificationsGroupId: number,
    userNotificationsGroup: number,
    chatId: number,
    messageId: number,
    locale: string,
    currency: string,
    amount: number,
    email: string,
  ) {
    const telegramBot = (await Prisma.telegramBot
      .findUniqueOrThrow({
        where: {
          id: botId,
        },
        include: {
          managementBot: true,
        },
      })
      .catch((e) => {
        Logger.info("Bot não encontrado no DB.");
      })) as iTelegramBotPayload;

    const bot = new Telegraf(telegramBot.token);

    const mgmtBot = new Telegraf(telegramBot.managementBot.token);

    const link = await mgmtBot.telegram.createChatInviteLink(privateGroupId, {
      name: "Convite VIP",
      expire_date: Math.floor(Date.now() / 1000) + 3600, // expira em 1h
      member_limit: 1, // só funciona para uma pessoa
    });

    //send invite link to seller bot message
    await bot.telegram.editMessageText(
      chatId,
      messageId,
      undefined,
      getMessage("joinGroup", locale),
      {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.url(
              // ✅ botão precisa ser URL, não callback
              getMessage("joinGroupCTA", locale),
              link.invite_link,
            ),
          ],
          [
            Markup.button.callback(
              getMessage("retryStart", locale),
              `plans/${currency}`,
            ),
          ],
        ]).reply_markup,
        parse_mode: "HTML",
      },
    );
  }
}

export default new TelegramUser();
