//types
import { Session as iSession, User as iUser } from "@prisma/client";
import iObserver from "../../@types/iObserver/iObserver.js";

//db
import prisma from "../../controllers/db.controller.js";
import iSessionAttempts from "../../@types/iSessionWithAttempt/iSessionWithAttempt.js";
import { connect } from "http2";

class incrementSessionAttempts implements iObserver {
  async update(data: { session: iSession; user: iUser }) {
    await prisma.attempt
      .create({
        data: {
          session: {
            connect: {
              id: data.session.id,
            },
          },
          user: {
            connect: {
              id: data.user.id,
            },
          },
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export default new incrementSessionAttempts();
