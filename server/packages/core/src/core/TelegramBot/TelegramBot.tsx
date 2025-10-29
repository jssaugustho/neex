import {
  Prisma as iPrisma,
  Seller as iSeller,
  User as iUser,
  TelegramBot as iTelegramBot,
  Account as iAccount,
  TelegramManagementBot as iTelegramManagementBot,
} from "@prisma/client";
import Prisma from "../Prisma/Prisma.js";

export type iTelegramBotPayload = iPrisma.TelegramBotGetPayload<{
  include: {
    managementBot: true;
    account: true;
  };
}>;

class TelegramBot {
  async createBot(
    botToken: string,
    mgmtBotToken: string,
    groupId: number,
    accountId: string,
    notificationsGroupId: number,
    videoUrl: string,
  ): Promise<iTelegramBotPayload> {
    return new Promise(async (resolve, reject) => {
      let telegramBot = await Prisma.telegramBot.create({
        data: {
          videoUrl,
          active: false,
          token: botToken,
          groupId,
          notificationsGroupId,
          account: {
            connect: {
              id: accountId,
            },
          },
          managementBot: {
            connect: {
              token: mgmtBotToken,
            },
          },
        },
        include: {
          account: true,
          managementBot: true,
        },
      });

      resolve(telegramBot);
    });
  }

  async startBot(telegramBotId: string): Promise<iTelegramBotPayload> {
    return new Promise(async (resolve, reject) => {
      let telegramBot = await Prisma.telegramBot.update({
        where: {
          id: telegramBotId,
        },
        data: {
          active: true,
        },
        include: {
          account: true,
          managementBot: true,
        },
      });

      resolve(telegramBot);
    });
  }

  async stopBot(botToken: string): Promise<iTelegramBotPayload> {
    return new Promise(async (resolve, reject) => {
      let bot = Prisma.telegramBot.update({
        where: {
          token: botToken,
        },
        data: {
          active: false,
        },
        include: {
          account: true,
          managementBot: true,
        },
      });

      resolve(bot);
    });
  }
}

export default new TelegramBot();
