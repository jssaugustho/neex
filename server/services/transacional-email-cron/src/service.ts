import { Neex } from "@neex/core";
import { Resend } from "resend";

import cron from "node-cron";

const { Prisma, Logger } = Neex();

const resend = new Resend(process.env.RESEND_API_TOKEN);

let isRunning = false;

cron.schedule("*/20 * * * * *", () => {
  if (!isRunning) {
    isRunning = true;
    Logger.info("Checking email queue.");
    Prisma.transacionalEmailQueue
      .findMany({
        where: {
          OR: [
            {
              status: "pending",
            },
            {
              status: "failed",
              attempts: {
                lte: 5,
              },
            },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
      })
      .then((emails) => {
        if (emails.length === 0) Logger.info("Empty queue.");
        else
          emails.forEach(async (email) => {
            await Prisma.transacionalEmailQueue.update({
              where: {
                id: email.id,
              },
              data: {
                status: "sending",
              },
            });

            const { data, error } = await resend.emails.send({
              from: `Neex Club © <${process.env.EMAIL_USER}>`,
              to: email.to,
              subject: email.subject,
              html: email.body,
            });

            if (error) {
              const upEmail = await Prisma.transacionalEmailQueue.update({
                where: {
                  id: email.id,
                },
                data: {
                  error: error as object,
                  status: "failed",
                  attempts: {
                    increment: 1,
                  },
                },
              });
              Logger.error(
                {
                  email: upEmail.to,
                  subject: upEmail.subject,
                  status: upEmail.status,
                  type: "Transacional",
                  error,
                },
                "Error sending email.",
              );
            } else {
              const upEmail = await Prisma.transacionalEmailQueue.update({
                where: {
                  id: email.id,
                },
                data: {
                  emailId: data?.id || "",
                  status: "success",
                },
              });
              Logger.info(
                {
                  email: upEmail.to,
                  subject: upEmail.subject,
                  status: upEmail.status,
                  type: "Transacional",
                },
                "Email sent.",
              );
            }
          });
      });
    isRunning = false;
  }
});
