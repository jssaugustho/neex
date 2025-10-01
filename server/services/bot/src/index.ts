import dotenv from "dotenv";
import { Context, Telegraf } from "telegraf";
import express from "express";
import bodyParser from "body-parser";
import startAction from "./actions/start.js";
import { v4 as uuidv4 } from "uuid";
import identifyLead from "./middlewares/identifyLead.js";
import currencyAction from "./actions/currency.js";
import planos from "./actions/planos.js";

import Neex from "@neex/core";
import methods from "./actions/methods.js";
import config from "./libs/config.js";
import stripe from "./actions/stripe.js";
import LeadContext from "./@types/context.js";

dotenv.config();

const processId = uuidv4();

const { Logger, TelegramBot, Prisma, Errors } = Neex();

const actualBot = await Prisma.telegramBot.findUnique({
  where: {
    id: config.BOT_ID,
  },
});

const ManagementBot = await Logger.info(
  {
    processId,
    botId: process.env.BOT_TOKEN,
  },
  "Initializing bot...",
);

const bot = new Telegraf<Context>(process.env.BOT_TOKEN as string);

bot.use(identifyLead);

// Comando /start
bot.start(startAction);

// Ações
bot.action("start", startAction);

bot.action(/^plans\/(brl|eur|usd)$/, planos);

bot.action(/^methods\/(usd|eur|brl)\/([a-f0-9]{24})$/, methods);

bot.action(/^stripe\/(usd|eur|brl)\/([a-f0-9]{24})$/, stripe);

// bot.action(/^methods (BRL|USD|EUR)$/, methods);

bot.action("currency", currencyAction);

const botStarted = await TelegramBot.startBot(config.BOT_ID);

bot.catch(async (err, ctx) => {
  await ctx.reply("Erro inesperado, tente novamente mais tarde.");
  await Errors.notifyError("Bot error.", "BOT", err, botStarted);
});

// Inicializa bot
bot.launch();

Logger.info(
  {
    account_username: process.env.ACCOUNT_USERNAME,
  },
  "Bot initialized...",
);
