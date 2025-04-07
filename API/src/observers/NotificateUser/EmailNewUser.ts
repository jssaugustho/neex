//types
import iObserver from "../../@types/iObserver/iObserver.js";
import { User as iUser, Session as iSession } from "@prisma/client";

//core
import Email from "../../core/Email/Email.js";

class EmailNewUser implements iObserver {
  update(data: { user: iUser; session: iSession }) {
    if (data.user.emailNotification)
      Email.sendEmail(
        data.user.email,
        "[VERIFICAÇÃO] Seja bem vindo ao Lux CRM ©",
        `<p>Para verificar sua conta basta <a herf="#">clicar aqui.</a><br/>
      Não compartilhe esse link com ninguém.</p>`
      );
  }
}

export default new EmailNewUser();
