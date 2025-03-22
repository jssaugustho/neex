import { Session, User } from "@prisma/client";
import Observer from "../../../@types/Observer/Observer.js";
import Email from "../../Email/Email.js";
import auth from "../../../routes/auth.route.js";
import Authentication from "../Authentication.js";

class EmailToUser implements Observer {
  update(data: { session: Session; userData: User }) {
    Email.sendEmail(
      data.userData.email,
      "Novo Login Detectado | Lux CRM ©",
      `<p>Novo login detectado na cidade de: <b>${Authentication.verifyIpCity(
        data.session.ip
      )}</b><br/>
      Não foi você? Clique aqui</p>`
    );
  }
}

export default new EmailToUser();
