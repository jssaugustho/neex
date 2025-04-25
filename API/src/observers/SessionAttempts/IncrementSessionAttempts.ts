//types
import { Session as iSession, User as iUser } from "@prisma/client";
import iObserver from "../../@types/iObserver/iObserver.js";

//db
import prisma from "../../controllers/db.controller.js";
import iSessionAttempts from "../../@types/iSessionAttempt/iSessionAttempt.js";

class incrementSessionAttempts implements iObserver {
  async update(data: { session: iSession; user: iUser }) {
    let attempts = data.session.attempts as object as iSessionAttempts;

    if (attempts[data.user.id]) {
      attempts[data.user.id].attempts += 1;
    } else
      attempts[data.user.id] = {
        attempts: 1,
        timeStamp: Date.now(),
      };

    attempts[data.user.id].timeStamp = Date.now();

    await prisma.session
      .update({
        where: {
          id: data?.session.id,
        },
        data: {
          attempts,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export default new incrementSessionAttempts();
