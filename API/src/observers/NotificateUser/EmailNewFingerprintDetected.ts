//types
import iObserver from "../../@types/iObserver/iObserver.js";
import { Session, User } from "@prisma/client";
import { Lookup } from "geoip-lite";

//core
import Email from "../../core/Email/Email.js";

class EmailNewFingerprintDetected implements iObserver {
  update(data: { session: Session; user: User }) {
    const sessionLocation = data.session.location as unknown as Lookup;
    if (data.user.emailNotification)
      Email.sendEmail(
        data.user.email,
        "Novo Login Detectado | Lux CRM ©",
        `<p>Novo login detectado na cidade de: <b>${sessionLocation.city}, ${sessionLocation.region}</b><br/>
      Não foi você? Clique aqui</p>`
      );
  }
}

export default new EmailNewFingerprintDetected();
