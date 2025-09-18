//types
import { TransacionalEmailQueue, User as iUser } from "@prisma/client";

//external libs
import { render } from "@react-email/render";
import React from "react";
import Prisma from "../Prisma/Prisma.js";
import Logger from "../Logger/Logger.js";

class Email {
  //core functions
  sendTransacionalEmail(
    to: string,
    subject: string,
    body: React.JSX.Element,
    log = true,
  ): Promise<TransacionalEmailQueue> {
    return new Promise(async (resolve, reject) => {
      Prisma.transacionalEmailQueue
        .create({
          data: {
            to,
            subject,
            body: await render(body),
            status: "pending",
          },
        })
        .then((email) => {
          if (log) Logger.info({ to, subject }, `Email queued to ${to}`);
          return resolve(email);
        })
        .catch((err) => reject(err));
    });
  }
}

export default new Email();
