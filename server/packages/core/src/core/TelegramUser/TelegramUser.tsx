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

export type iLeadPayload = iPrisma.LeadGetPayload<{
  include: { telegramUser: true; product: true };
}>;

class TelegramUser {
  async upsert(
    telegramId: string,
    language: string,
    username: string,
    requestId: string,
    chatId: number,
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

      let telegramUser: iTelegramUser | null = null;

      telegramUser = await Prisma.telegramUser.findUnique({
        where: {
          telegramId,
        },
      });

      let data = {
        language,
        telegramId,
        username,
      };

      if (!telegramUser)
        telegramUser = await Prisma.telegramUser.create({
          data: {
            language,
            telegramId,
            username,
            chatId,
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
        chatId,
        messageId,
      },
    });
  }

  async sendGroupLink(
    botId: string,
    groupId: number,
    chatId: number,
    messageId: number,
    locale: string,
    currency: string,
  ) {
    const telegramBot = (await Prisma.telegramBot
      .findUniqueOrThrow({
        where: {
          id: botId,
        },
      })
      .catch((e) => {
        Logger.info("Bot não encontrado no DB.");
      })) as iTelegramBot;

    const bot = new Telegraf(telegramBot.token);

    // 1️⃣ Confirma se o grupo existe e se o bot vê ele
    const chat = await bot.telegram.getChat(groupId);

    // 2️⃣ Confirma se o bot é admin do grupo
    const admins = await bot.telegram.getChatAdministrators(groupId);
    const botIsAdmin = admins.some(
      async (a) => a.user.id === (await bot.telegram.getMe()).id,
    );

    if (!botIsAdmin) {
      Logger.error(chat, "⚠️ Bot não é admin do grupo:");
      return;
    }

    const link = await bot.telegram.createChatInviteLink(groupId, {
      name: "Convite VIP",
      expire_date: Math.floor(Date.now() / 1000) + 3600, // expira em 1h
      member_limit: 1, // só funciona para uma pessoa
    });

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
