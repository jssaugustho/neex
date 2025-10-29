import { MiddlewareFn, Context } from "telegraf";

import NeexCore from "../libs/core.js";

import { v4 as uuidv4 } from "uuid";

import { getCountryByLocale } from "../libs/countries.js";
import { iTelegramBotPayload } from "packages/core/src/core/TelegramBot/TelegramBot.js";

const { Lead, TelegramUser, Logger, Prisma, Account } = NeexCore;

const identifyLead: MiddlewareFn<Context> = async (ctx, next) => {
  let telegramBot = ctx.state.telegramBot as iTelegramBotPayload;

  ctx.state.requestId = uuidv4();
  ctx.state.telegramId = String(ctx?.from?.id as number);

  let locale = getCountryByLocale(ctx.from?.language_code || "en-US");

  ctx.state.locale = locale.locale;
  ctx.state.currency = locale.currency;
  ctx.state.slug = locale.slug;

  Logger.info(
    {
      requestId: ctx.state.requestId,
      language: ctx.state.language,
      currency: ctx.state.currency,
      telegramId: ctx.from?.id,
      username: ctx.from?.username,
    },
    "Identified lead.",
  );

  ctx.state.username = ctx.from?.username || "anonymous";

  Logger.info("Identified currency: " + ctx.state.currency);

  ctx.state.telegramUser = await TelegramUser.upsert(
    ctx.state.telegramId,
    ctx.state.locale,
    ctx.state.username,
    ctx.state.requestId,
    ctx.chat?.id || 0,
    ctx.message?.message_id || 0,
  );

  ctx.state.lead = await Lead.upsert(ctx.state.telegramUser, telegramBot.id);

  ctx.state.product = await Prisma.product
    .findUniqueOrThrow({
      where: {
        id: ctx.state.lead.product?.id,
      },
      include: {
        prices: true,
      },
    })
    .catch(() => null);

  ctx.state.seller = await Prisma.seller.findUnique({
    where: {
      accountId: telegramBot.accountId,
    },
    include: {
      account: true,
      user: true,
    },
  });

  let account = await Account.getAccount(ctx.state.seller.accountId);

  ctx.state.account = account;

  ctx.state.user = await Prisma.user.findUnique({
    where: {
      id: account?.userId,
    },
  });

  Logger.info(
    {
      username: ctx.state.username,
      language: ctx.state.language,
      currency: ctx.state.currency,
      telegramId: ctx.state.telegramId,
    },
    "Identified lead.",
  );

  await next();
};

export default identifyLead;
