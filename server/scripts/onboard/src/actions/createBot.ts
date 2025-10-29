import { Telegraf } from "telegraf";
import { Neex } from "@neex/core";
import inquirer from "inquirer";

import { TelegramBot as iTelegramBot } from "@prisma/client";

const { TelegramBot, Prisma } = Neex();

async function createBot(
  accountIdLoaded?: string,
  mgmtBotToken?: string,
): Promise<iTelegramBot> {
  console.log("\n");

  const {
    notificationsGroupId,
    mgmtToken,
    accountId,
    token,
    groupId,
    videoUrl,
  } = await inquirer.prompt<{
    accountId: string;
    token: string;
    groupId: string;
    mgmtToken: string;
    notificationsGroupId: string;
    videoUrl: string;
  }>([
    {
      type: "input",
      name: "accountId",
      message: "Account ID:",
      default: accountIdLoaded || "",
      required: true,
    },
    {
      type: "input",
      name: "token",
      message: "Telegram Bot Token:",
      required: true,
    },
    {
      type: "input",
      name: "mgmtToken",
      message: "Management Bot Token:",
      default: mgmtBotToken || "",
      required: true,
    },
    {
      type: "input",
      name: "groupId",
      message: "Group ID:",
      required: true,
    },
    {
      type: "input",
      name: "notificationsGroupId",
      message: "Botifications Group ID:",
      required: true,
    },
    {
      type: "input",
      name: "videoUrl",
      message: "Video URL:",
      required: true,
    },
  ]);

  console.log("\nStarting a new bot...");

  const telegramBot = await TelegramBot.createBot(
    token,
    mgmtToken,
    parseInt(groupId),
    accountId,
    parseInt(notificationsGroupId),
    videoUrl,
  );

  const bot = new Telegraf(token);

  bot.telegram.setWebhook(`${telegramBot.secretToken}$${telegramBot.id}`);

  console.log("Bot Started.");

  return telegramBot;
}

export default createBot;
