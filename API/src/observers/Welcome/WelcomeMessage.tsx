import React from "react";

//types
import iObserver from "../../@types/iObserver/iObserver.js";
import { User as iUSer, Session as iSession } from "@prisma/client";

import Email from "../../core/Email/Email.js";
import WelcomeEmail from "../../core/Email/models/welcome.jsx";

class WelcomeMessage implements iObserver {
  async update(data: { user: iUSer; token: string }) {
    await Email.sendEmail(
      data.user.email,
      "Ative a sua conta | Lux CRM ©",
      <WelcomeEmail user={data.user} token={data.token} />
    ).catch((err) => {
      console.log(err);
    });
  }
}

export default new WelcomeMessage();
