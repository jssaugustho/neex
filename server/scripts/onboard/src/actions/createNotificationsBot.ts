import Neex from "@neex/core";
import inquirer from "inquirer";

import {
  User as iUser,
  Account as iAccount,
  Seller as iSeller,
  TelegramManagementBot as iTelegramManagementBot,
} from "@prisma/client";
import writeInEnv from "../lib/environment.js";
import ManagementBot from "packages/core/src/core/ManagementBot/ManagementBot.js";

const { TelegramBot, Prisma } = Neex();

async function createMGMTBot(): Promise<iTelegramManagementBot> {
  console.log("\n");

  const { userId, token, groupId } = await inquirer.prompt<{
    token: string;
    groupId: string;
    userId: string;
  }>([
    {
      type: "input",
      name: "token",
      message: "Notifications Bot Token:",
      default: process.env.MANAGEMENT_BOT_TOKEN || "",
      required: true,
    },
    {
      type: "input",
      name: "groupId",
      message: "Notifications Group ID:",
      default: process.env.NOTIFICATIONS_GROUP_ID || "",
      required: true,
    },
    {
      type: "input",
      name: "userId",
      message: "Admin USER ID:",
      required: true,
      default: process.env.ADMIN_USER_ID || "",
    },
  ]);

  console.log("\nStarting a new bot...");

  const bot = await ManagementBot.upsertManagementBot(
    token,
    parseInt(groupId),
    userId,
  );

  writeInEnv({
    MANAGEMENT_BOT_ID: bot.id,
  });

  console.log("Bot Started.");

  return bot;
}

export default createMGMTBot;
