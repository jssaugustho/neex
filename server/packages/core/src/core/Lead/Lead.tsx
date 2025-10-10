import {
  Prisma as iPrisma,
  TelegramUser as iTelegramUser,
  TelegramBot as iTelegramBot,
  Lead as iLead,
} from "@prisma/client";
import Prisma from "../Prisma/Prisma.js";
import Logger from "../Logger/Logger.js";

export type iLeadPayload = iPrisma.LeadGetPayload<{
  include: { telegramUser: true; product: true; telegramBot: true };
}>;

class Lead {
  async upsert(
    telegramUser: iTelegramUser,
    botId: string,
  ): Promise<iLeadPayload> {
    return new Promise(async (resolve, reject) => {
      Logger.info(
        {
          action: "start",
          telegramUserId: telegramUser.id,
        },
        `Upserting Lead...`,
      );

      let lead: iLeadPayload | null = null;

      lead = await Prisma.lead.findFirst({
        where: {
          telegramUser: {
            id: telegramUser.id,
          },
        },
        include: { telegramUser: true, product: true, telegramBot: true },
      });

      if (!lead)
        lead = await Prisma.lead.create({
          data: {
            legalAge: true,
            telegramBot: {
              connect: {
                id: botId,
              },
            },
            telegramUser: {
              connect: {
                id: telegramUser.id,
              },
            },
          },
          include: { telegramUser: true, product: true, telegramBot: true },
        });

      resolve(lead);
    });
  }

  async setPlan(leadId: string, productId: string): Promise<iLeadPayload> {
    return new Promise(async (resolve, reject) => {
      const lead = await Prisma.lead.update({
        where: {
          id: leadId,
        },
        data: {
          product: {
            connect: {
              id: productId,
            },
          },
        },
        include: {
          product: true,
          telegramUser: true,
          telegramBot: true,
        },
      });

      resolve(lead);
    });
  }
}

export default new Lead();
