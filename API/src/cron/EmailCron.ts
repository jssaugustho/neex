import { Resend } from "resend";

import prisma from "../controllers/db.controller.js";
import cron from "node-cron";

const resend = new Resend(process.env.RESEND_API_TOKEN);

let isRunning = false;

cron.schedule("*/20 * * * * *", () => {
  if (!isRunning) {
    isRunning = true;
    console.log("Verificando lista de emails...");
    prisma.transacionalEmailQueue
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
            await prisma.transacionalEmailQueue.update({
              where: {
                status: "pending",
                id: email.id,
              },
              data: {
                status: "sending",
              },
            });

            const { data, error } = await resend.emails.send({
              from: `Lux CRM © <${process.env.EMAIL_USER}>`,
              to: email.to,
              subject: email.subject,
              html: email.body,
            });

            if (error) {
              console.log("Não foi possível enviar email: ", email.to);
              await prisma.transacionalEmailQueue.update({
                where: {
                  id: email.id,
                  error: error as object,
                },
                data: {
                  status: "failed",
                },
              });
            } else {
              await prisma.transacionalEmailQueue.update({
                where: {
                  id: email.id,
                },
                data: {
                  emailId: data?.id || "",
                  status: "success",
                },
              });
              console.log("Email enviado para: ", email.to);
            }
          });
      });
    isRunning = false;
  }
});
