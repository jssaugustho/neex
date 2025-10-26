import { Telegraf } from "telegraf";
import { Resend } from "resend";

import cron from "node-cron";

import { Neex } from "@neex/core";
import { iTelegramBotPayload } from "packages/core/src/core/TelegramBot/TelegramBot.js";
import { iLeadPayload } from "packages/core/src/core/Lead/Lead.js";
import { isExpired } from "./lib/Date.js";

const { Prisma, Logger, ManagementBot, Date } = Neex();

const resend = new Resend(process.env.RESEND_API_TOKEN);

let isRunning = false;

cron.schedule("*/15 * * * *", async () => {
  if (!isRunning) {
    isRunning = true;
    Logger.info("Checking Bots.");
    const bots: iTelegramBotPayload[] = await Prisma.telegramBot.findMany({
      include: {
        managementBot: true,
        account: true,
      },
    });

    for (const [index, bot] of bots.entries()) {
      let telegrafBot = new Telegraf(bot.managementBot.token);

      Logger.info({ index, bot }, "Verifying bot...");

      const leads: iLeadPayload[] = await Prisma.lead.findMany({
        where: {
          telegramBotId: bot.id,
          status: "ACTIVE",
        },
        include: {
          telegramBot: true,
          telegramUser: true,
          product: true,
        },
      });

      for (const [index, lead] of leads.entries()) {
        if (lead.expiresAt) {
          if (isExpired(lead.expiresAt)) {
            Logger.info({ lead }, "Expired.");
            try {
              await telegrafBot.telegram.banChatMember(
                bot.groupId,
                parseInt(lead.telegramUser.telegramId, 10),
              );

              let newLead = await Prisma.lead.update({
                where: {
                  id: lead.id,
                },
                data: {
                  status: "CHURN",
                },
              });

              Logger.info({ newLead }, "Banned member.");

              await ManagementBot.notifyChurn(lead, bot);
            } catch (err: any) {
              Logger.warn({ lead, err }, "Can't ban lead.");
            }
          } else {
            Logger.info({ lead }, "Active billing.");
          }
        }
      }
    }
    isRunning = false;
  }
});
