//types
import iObserver from "../../@types/iObserver/iObserver.js";
import { User as iUSer, Session as iSession } from "@prisma/client";

import Email from "../../core/Email/Email.js";
import React from "react";
import verifyEmail from "../../core/Email/models/verifyEmail.js";

class SendVerificationCode implements iObserver {
  async update(data: { user: iUSer; token: string }) {
    await Email.sendEmail(
      data.user.email,
      "Verifique seu email | Lux CRM ©",
      <verifyEmail token={data.token} user={data.user} />
    ).catch((err) => {
      console.log(err);
    });
  }
}

export default new SendVerificationCode();
