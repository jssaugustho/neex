import { MiddlewareFn, Context } from "telegraf";

import NeexCore from "../libs/core.js";

import { v4 as uuidv4 } from "uuid";
import config from "../libs/config.js";
import { allowedLocales } from "../libs/i18n.js";
import { currencies } from "../libs/currencies.js";

const { Lead, TelegramUser, Logger, Prisma, Account } = NeexCore;

const identifyLead: MiddlewareFn<Context> = async (ctx, next) => {
  ctx.state.requestId = uuidv4();
  ctx.state.telegramId = String(ctx?.from?.id as number);

  ctx.state.locale = allowedLocales.includes(ctx.from?.language_code || "")
    ? ctx.from?.language_code
    : "en-us";

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
  ctx.state.currency = currencies[ctx.state.locale]?.code || "usd";

  Logger.info("Identified currency: " + ctx.state.currency);

  ctx.state.telegramUser = await TelegramUser.upsert(
    ctx.state.telegramId,
    ctx.state.locale,
    ctx.state.username,
    ctx.state.requestId,
    ctx.chat?.id || 0,
    ctx.message?.message_id || 0,
  );

  ctx.state.lead = await Lead.upsert(ctx.state.telegramUser, config.BOT_ID);

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
      id: config.SELLER_ID,
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

  ctx.state.telegramBot = await Prisma.telegramBot.findUnique({
    where: {
      id: config.BOT_ID,
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
