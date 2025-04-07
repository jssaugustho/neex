//types
import { Session as iSession } from "@prisma/client";
import iObserver from "../../@types/iObserver/iObserver.js";

//db
import prisma from "../../controllers/db.controller.js";

class ResetEmailExpires implements iObserver {
  async update(data?: { session: iSession }) {
    //verify if is correctly passwd
    await prisma.session
      .update({
        where: {
          id: data?.session.id,
        },
        data: {
          exponencialEmailExpires: 0,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export default new ResetEmailExpires();
