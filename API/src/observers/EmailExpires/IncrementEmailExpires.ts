//types
import { Session as iSession } from "@prisma/client";
import iObserver from "../../@types/iObserver/iObserver.js";

//db
import prisma from "../../controllers/db.controller.js";

class incrementEmailExpires implements iObserver {
  async update(data?: { session: iSession }) {
    let exponencial: {
      increment?: number;
      multiply?: number;
    } = {
      multiply: 2,
    };

    if (data?.session.exponencialEmailExpires === 0) {
      exponencial = {
        increment: 1,
      };
    }

    await prisma.session.update({
      where: {
        id: data?.session.id,
      },
      data: {
        exponencialEmailExpires: exponencial,
      },
    });
  }
}

export default new incrementEmailExpires();
