//types
import iObserver from "../../@types/iObserver/iObserver.js";
import { User as iUser, Session as iSession } from "@prisma/client";

//core
import Email from "../../core/Email/Email.js";

//db
import prisma from "../../controllers/db.controller.js";
import iLookup from "../../@types/iLookup/iLookup.js";
import { Lookup } from "geoip-lite";

class EmailNewUserAdmin implements iObserver {
  async update(data: { user: iUser; session: iSession }) {
    const admins = await prisma.user
      .findMany({
        where: {
          role: "ADMIN",
        },
      })
      .catch((err) => {
        console.log(err);
      });

    if (!admins) return;

    let location: Lookup;

    if (typeof data.session.location === "object")
      location = data.session.location as unknown as Lookup;

    admins.forEach(async (admin) => {
      await Email.sendEmail(
        admin.email,
        "Novo usuário cadastrado no CRM.",
        `<p>Nome: ${data.user.name} ${data.user.lastName}</p>
        <p>Email: ${data.user.email}</p>
        <p>Celular: ${data.user.phone}</p>
        <p>Localização: ${location.city}</p>
        <p>Celular: ${data.user.phone}</p>`
      );
    });
  }
}

export default new EmailNewUserAdmin();
