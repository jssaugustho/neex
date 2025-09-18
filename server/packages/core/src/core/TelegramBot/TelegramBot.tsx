import {
  Prisma as iPrisma,
  Seller as iSeller,
  User as iUser,
  TelegramBot as iTelegramBot,
  Account as iAccount,
} from "@prisma/client";
import Prisma from "../Prisma/Prisma.js";
import { connect } from "http2";

class TelegramBot {
  async createBot(
    botToken: string,
    groupId: number,
    accountId: string,
  ): Promise<iTelegramBot> {
    return new Promise(async (resolve, reject) => {
      let telegramBot = await Prisma.telegramBot.create({
        data: {
          active: false,
          token: botToken,
          groupId,
          account: {
            connect: {
              id: accountId,
            },
          },
        },
      });

      resolve(telegramBot);
    });
  }

  async startBot(telegramBotId: string): Promise<iTelegramBot> {
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
        },
      });

      resolve(telegramBot);
    });
  }

  async stopBot(botToken: string): Promise<iTelegramBot> {
    return new Promise(async (resolve, reject) => {
      let bot = Prisma.telegramBot.update({
        where: {
          token: botToken,
        },
        data: {
          active: false,
        },
      });

      resolve(bot);
    });
  }
}

export default new TelegramBot();
