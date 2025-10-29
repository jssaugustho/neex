import { Telegraf } from "telegraf";
import Logger from "../Logger/Logger.js";
import ManagementBot from "../ManagementBot/ManagementBot.js";
import Prisma from "../Prisma/Prisma.js";
import { TelegramManagementBot } from "@prisma/client";

const mgmtBotData = (await Prisma.telegramManagementBot.findUnique({
  where: {
    id: process.env.MGMT_BOT_ID,
  },
})) as TelegramManagementBot;

const mgmtBot = new Telegraf(mgmtBotData?.token);

class Services {
  async reportCrash(slug: string, name: string, description: string) {
    Logger.error(slug + " CRASHED");

    await Prisma.services
      .findUniqueOrThrow({
        where: {
          slug: "bot",
        },
      })
      .then(async (service) => {
        if (!service.notified)
          await ManagementBot.notificateCrash(mgmtBotData, mgmtBot, slug);
        return await Prisma.services.update({
          where: { id: service?.id },
          data: {
            status: "CRASHED",
            notified: true,
          },
        });
      })
      .catch(async () => {
        return await Prisma.services.create({
          data: {
            slug,
            status: "CRASHED",
            name,
            description,
          },
        });
      });
  }

  async reportUp(slug: string, name: string, description: string) {
    Logger.info(slug + " UP");

    return await Prisma.services
      .findUniqueOrThrow({
        where: {
          slug,
        },
      })
      .then(async (service) => {
        return await Prisma.services.update({
          where: { id: service?.id },
          data: {
            status: "RUNNING",
          },
        });
      })
      .catch(async () => {
        return await Prisma.services.create({
          data: {
            slug,
            status: "RUNNING",
            name,
            description,
          },
        });
      });
  }
}

export default new Services();
