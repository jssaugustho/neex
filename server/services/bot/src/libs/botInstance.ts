import methods from "../actions/methods.js";
import planos from "../actions/plans.js";
import startAction from "../actions/start.js";
import stripe from "../actions/stripe.js";
import identifyLead from "../middlewares/identifyLead.js";
import { Context, Telegraf } from "telegraf";
import BotCache from "./cache.js";
import { iTelegramBotPayload } from "packages/core/src/core/TelegramBot/TelegramBot.js";
import NeexCore from "./core.js";

import countryAction from "../actions/country.js";
import {
  getSupportedSlugs,
  makeRegex,
  makeRegexFromSupportedSlugs,
  SUPPORTED_SLUGS,
} from "./countries.js";
import consentMessage from "../actions/consentMessage.js";

const cache = new BotCache(200, 10 * 60 * 1000);

const { Errors, Logger } = NeexCore;

async function botInstance(telegramBot: iTelegramBotPayload) {
  const cached = cache.get(telegramBot.id);

  if (cached) return cached;

  if (!telegramBot) throw new Error("Bot não existe no DB.");

  const bot = new Telegraf<Context>(telegramBot.token);

  bot.use(async (ctx, next) => {
    ctx.state.telegramBot = telegramBot;
    next();
  });

  bot.use(identifyLead);

  // Comando /start
  bot.start(startAction);

  // Ações
  bot.action("start", startAction);

  bot.action(makeRegexFromSupportedSlugs("plans"), planos);

  bot.action(makeRegexFromSupportedSlugs("methods", true), methods);

  bot.action(makeRegexFromSupportedSlugs("stripe", true), stripe);

  bot.action("country", countryAction);

  bot.action(makeRegexFromSupportedSlugs("consent", false), consentMessage);

  bot.catch(async (err, ctx) => {
    Logger.error({ err }, "Erro inesperado.");
    await ctx.reply("Erro inesperado, tente novamente mais tarde.");
    await Errors.notifyError("Bot error.", "BOT", err, telegramBot);
  });

  return bot;
}

export default botInstance;
