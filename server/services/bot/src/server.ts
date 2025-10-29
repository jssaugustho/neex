import "express-async-errors";

import express, { Request, Response, json } from "express";
import botInstance from "./libs/botInstance.js";
import NeexCore from "./libs/core.js";

const { Logger, Prisma } = NeexCore;

const app = express();

app.use(json({ limit: "1mb" }));

function validateTelegramSecret(expected?: string) {
  return (req, res, next) => {
    if (!expected) return next();
    const h = req.get("X-Telegram-Bot-Api-Secret-Token");
    if (h !== expected) return res.sendStatus(401);
    next();
  };
}

app.post("/webhooks/telegram/:botId", async (req: Request, res: Response) => {
  const botId: string = req.params?.botId || "";

  const telegramBot = await Prisma.telegramBot.findUnique({
    where: {
      id: botId,
    },
    include: {
      managementBot: true,
      account: true,
    },
  });

  if (!telegramBot) return res.status(404);

  validateTelegramSecret(telegramBot.secretToken)(req, res, async () => {
    const bot = await botInstance(telegramBot);

    return bot.webhookCallback(`/webhooks/telegram/${botId}`)(req, res);
  });
});

app.get("/health", (req, res) => {
  Logger.info("Health check.");
  res.status(200).send({
    message: "Ok",
  });
});

const port = process.env.TELEGRAM_WEBHOOK_PORT;

if (!port) {
  Logger.error("TELEGRAM_WEBHOOK_PORT undefined");
  process.exit(1);
}

app.listen(port, () => {
  Logger.info(
    {
      port,
      url: process.env.TELEGRAM_WEBHOOK_URL,
      mode: process.env.NODE_ENV,
    },
    `Telegram Webhook Listening on: ${process.env.TELEGRAM_WEBHOOK_URL}`,
  );
});
