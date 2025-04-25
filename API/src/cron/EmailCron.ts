import nodemailer, { TransportOptions } from "nodemailer";

import prisma from "../controllers/db.controller.js";
import cron from "node-cron";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: new Number(process.env.SMTP_PORT),
  secure: new Boolean(process.env.SMTP_SECURE),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWD,
  },
} as TransportOptions);

let isRunning = false;

cron.schedule("*/20 * * * * *", () => {
  if (!isRunning) {
    isRunning = true;
    console.log("Verificando lista de emails...");
    prisma.emailQueue
      .findMany({
        where: {
          status: "pending",
        },
        orderBy: {
          createdAt: "asc",
        },
      })
      .then((emails) => {
        if (emails.length === 0) console.log("Lista vazia.");
        else
          emails.forEach(async (email) => {
            await prisma.emailQueue.update({
              where: {
                status: "pending",
                id: email.id,
              },
              data: {
                status: "sending",
              },
            });

            transporter
              .sendMail({
                to: email.to,
                subject: email.subject,
                from: `Lux CRM © <${process.env.EMAIL_USER}>`,
                html: email.body,
              })
              .then(async () => {
                await prisma.emailQueue.update({
                  where: {
                    id: email.id,
                  },
                  data: {
                    status: "success",
                  },
                });
                console.log("Email enviado para: ", email.to);
              })
              .catch(async (err) => {
                console.log("Não foi possível enviar email: ", email.to);
                console.log(err);
                await prisma.emailQueue.update({
                  where: {
                    id: email.id,
                    error: err,
                  },
                  data: {
                    status: "failed",
                  },
                });
              });
          });
      });
    isRunning = false;
  }
});
