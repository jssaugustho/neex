//types
import iObserver from "../../@types/iObserver/iObserver.js";
import { Session, User } from "@prisma/client";
import { Lookup } from "geoip-lite";
import React from "react";

//core
import Email from "../../core/Email/Email.js";
import NewLoginDetected from "../../core/Email/models/newLoginDetected.jsx";

class EmailNewFingerprintDetected implements iObserver {
  update(data: { session: Session; user: User }) {
    const sessionLocation = data.session.location as unknown as Lookup;
    Email.sendEmail(
      data.user.email,
      "Novo Login Detectado | Lux CRM ©",
      <NewLoginDetected user={data.user} session={data.session} />
    );
  }
}

export default new EmailNewFingerprintDetected();
