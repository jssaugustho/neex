//types
import iObserver from "../../@types/iObserver/iObserver.js";
import { User as iUSer, Session as iSession } from "@prisma/client";

//core
import Verification from "../../core/Verification/Verification.js";
import Email from "../../core/Email/Email.js";

class EmailVerified implements iObserver {
  async update(data: { user: iUSer; session: iSession }) {
    Email.sendEmail(
      data.user.email,
      "Email Verificado Com Sucesso | Lux CRM ©",
      `<p>Agora você pode ter acesso à plataforma do Lux CRM com todos os seus recursos.</p>`
    ).catch((err) => {
      console.log(err);
    });
  }
}

export default new EmailVerified();
