//types
import { Session as iSession, User as iUser } from "@prisma/client";
import iObserver from "../../@types/iObserver/iObserver.js";

//db
import prisma from "../../controllers/db.controller.js";

class ResetSessionAttempts implements iObserver {
  async update(data: { session: iSession; user: iUser }) {
    await prisma.attempt.updateMany({
      where: {
        sessionId: data.session.id,
        userId: data.user.id,
      },
      data: {
        active: false,
      },
    });
  }
}

export default new ResetSessionAttempts();
