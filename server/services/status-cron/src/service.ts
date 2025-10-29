import { Neex } from "@neex/core";
import { Resend } from "resend";

import cron from "node-cron";
import axios from "axios";

const { Prisma, Logger, Services } = Neex();

const resend = new Resend(process.env.RESEND_API_TOKEN);

let isRunning = false;

cron.schedule("*/20 * * * * *", () => {
  if (!isRunning) {
    isRunning = true;
    Logger.info("Checking health status.");

    axios
      .get(process.env.TELEGRAM_WEBHOOK_URL + "/health", { timeout: 5000 })
      .then(async (res) => {
        await Services.reportUp(
          "bot",
          "Bot",
          "Webhook que gerencia os bots do telegram com cache.",
        );
      })
      .catch(async () => {
        await Services.reportCrash(
          "bot",
          "Bot",
          "Webhook que gerencia os bots do telegram com cache.",
        );
      });

    axios
      .get(process.env.EMAIL_QUEUE_URL + "/health", { timeout: 5000 })
      .then(async (res) => {
        await Services.reportUp(
          "transacional-email-cron",
          "Fila de emails transacionais.",
          "Executa a fila de emails transacionais.",
        );
      })
      .catch(async () => {
        await Services.reportCrash(
          "transacional-email-cron",
          "Fila de emails transacionais.",
          "Executa a fila de emails transacionais.",
        );
      });

    axios
      .get(process.env.WEBHOOKS_URL + "/health", { timeout: 5000 })
      .then(async (res) => {
        await Services.reportUp(
          "webhooks",
          "Webhooks",
          "Recebe notificações de pagamentos.",
        );
      })
      .catch(async () => {
        await Services.reportCrash(
          "webhooks",
          "Webhooks",
          "Recebe notificações de pagamentos.",
        );
      });

    isRunning = false;
  }
});
