import {
  Prisma as iPrisma,
  TelegramUser as iTelegramUser,
  TelegramBot as iTelegramBot,
  Lead as iLead,
  TelegramManagementBot as iTelegramManagementBot,
} from "@prisma/client";
import Prisma from "../Prisma/Prisma.js";
import Logger from "../Logger/Logger.js";

import { Telegraf } from "telegraf";
import { getMessage } from "../../lib/getMessage.js";
import { iTelegramBotPayload } from "../TelegramBot/TelegramBot.js";
import { iStripePayment } from "../StripePayments/StripePayments.js";
import { iAccountPayload } from "../Account/Account.js";

export type iLeadPayload = iPrisma.LeadGetPayload<{
  include: { telegramUser: true; product: true };
}>;

const formatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

class ManagementBot {
  async notificateTelegram(
    account: iAccountPayload,
    botId: string,
    notificationsGroupId: number,
    userNotificationsGroupId: number,
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

    const mgmtBot = new Telegraf(telegramBot.managementBot.token);

    //send notification to general notification group
    await mgmtBot.telegram.sendMessage(
      notificationsGroupId,
      getMessage("telegramSellerNotification", locale, {
        time: formatter.format(Date.now()),
        price: getMessage(currency, locale, {
          price: (amount / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        }),
        account: account.name,
        email,
      }),
      {
        parse_mode: "HTML",
      },
    );

    //send notification to user notification group
    await mgmtBot.telegram.sendMessage(
      userNotificationsGroupId,
      getMessage("telegramSellerNotification", locale, {
        time: formatter.format(Date.now()),
        price: getMessage(currency, locale, {
          price: (amount / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        }),
        account: account.name,
        email,
      }),
      {
        parse_mode: "HTML",
      },
    );
  }

  async upsertManagementBot(
    botToken: string,
    notificationsGroupId: number,
    errorsGroupId: number,
    userId: string,
  ): Promise<iTelegramManagementBot> {
    let bot = await Prisma.telegramManagementBot.findUnique({
      where: {
        token: botToken,
      },
    });

    if (!bot)
      bot = await Prisma.telegramManagementBot.create({
        data: {
          errorsGroupId,
          active: true,
          token: botToken,
          notificationsGroupId,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    else {
      bot = await Prisma.telegramManagementBot.update({
        where: {
          id: bot.id,
        },
        data: {
          errorsGroupId,
          active: true,
          token: botToken,
          notificationsGroupId,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }

    return bot;
  }

  async notifyChurn(lead: iLeadPayload, bot: iTelegramBotPayload) {
    const telegrafBot = new Telegraf(bot.managementBot.token);

    await telegrafBot.telegram.sendMessage(
      bot.managementBot.errorsGroupId,
      getMessage("telegramChurnNotification", "pt-br", {
        account: bot.account.name,
        botId: bot.id,
        leadName: lead.telegramUser.username,
        expiresAt: lead.expiresAt
          ? formatter.format(lead.expiresAt)
          : "indefinido.",
      }),
      {
        parse_mode: "HTML",
      },
    );

    Logger.info({ lead, bot }, "Lead churn.");
  }
}

export default new ManagementBot();
