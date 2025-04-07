//types
import iObserver from "../../@types/iObserver/iObserver.js";
import { User as iUSer, Session as iSession } from "@prisma/client";

//core
import Verification from "../../core/Verification/Verification.js";
import Email from "../../core/Email/Email.js";

class SendVerificationCode implements iObserver {
  async update(data: { user: iUSer; token: string }) {
    Email.sendEmail(
      data.user.email,
      "Verifique seu email | Lux CRM ©",
      `<p>Para verificar sua conta basta <a href="${process.env.API_URL}verify-email/?token=${data.token}">clicar aqui.</a><br/>
        Esse link expira em 10 minutos.<br/>
        Não compartilhe esse link com ninguém.</p>`
    ).catch((err) => {
      console.log(err);
    });
  }
}

export default new SendVerificationCode();
