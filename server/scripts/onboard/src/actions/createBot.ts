import Neex from "@neex/core";
import inquirer from "inquirer";

import {
  User as iUser,
  Account as iAccount,
  Seller as iSeller,
  TelegramBot as iTelegramBot,
} from "@prisma/client";
import writeInEnv from "../lib/environment.js";

const { TelegramBot, Prisma } = Neex();

async function createBot(
  accountIdLoaded?: string,
  mgmtBotToken?: string,
): Promise<iTelegramBot> {
  console.log("\n");

  const { notificationsGroupId, mgmtToken, accountId, token, groupId } =
    await inquirer.prompt<{
      accountId: string;
      token: string;
      groupId: string;
      mgmtToken: string;
      notificationsGroupId: string;
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
    ]);

  console.log("\nStarting a new bot...");

  const bot = await TelegramBot.createBot(
    token,
    mgmtToken,
    parseInt(groupId),
    accountId,
    parseInt(notificationsGroupId),
  );

  writeInEnv({
    BOT_ID: bot.id,
  });

  console.log("Bot Started.");

  return bot;
}

export default createBot;
