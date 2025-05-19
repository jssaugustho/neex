//types
import iObserver from "../../@types/iObserver/iObserver.js";
import { Session, User } from "@prisma/client";
import { Lookup } from "geoip-lite";
import React from "react";

//core
import Email from "../../core/Email/Email.js";
import NewLoginDetected from "../../core/Email/models/newLoginDetected.jsx";
import iSessionPayload from "../../@types/iSessionPayload/iSessionPayload.js";

class EmailNewFingerprintDetected implements iObserver {
  update(data: { session: iSessionPayload; user: User }) {
    const sessionLocation = data.session.ip;
    Email.sendEmail(
      data.user.email,
      `Novo Login Detectado em ${data.session.ip.city}, ${data.session.ip.region} às ${new Date(
        data.session.lastActivity
      ).toLocaleTimeString(data.session.locale || "pt-br", {
        timeZone: sessionLocation.timeZone || "America/Sao_Paulo",
      })} | Lux CRM ©`,
      <NewLoginDetected user={data.user} session={data.session} />
    );
  }
}

export default new EmailNewFingerprintDetected();
