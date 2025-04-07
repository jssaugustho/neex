//types
import { Session as iSession } from "@prisma/client";
import iObserver from "../../@types/iObserver/iObserver.js";

//db
import prisma from "../../controllers/db.controller.js";

class incrementSessionAttempts implements iObserver {
  async update(data?: { session: iSession }) {
    await prisma.session
      .update({
        where: {
          id: data?.session.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export default new incrementSessionAttempts();
