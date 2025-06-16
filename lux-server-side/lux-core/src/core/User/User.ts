//errors & response
import errors from "../../errors/errors.js";
import { getMessage } from "../../locales/getMessage.js";

//types
import { User as iUser, Session as iSession } from "@prisma/client";

//core
import Verification from "../Verification/Verification.js";

import Prisma from "../Prisma/Prisma.js";
import Logger from "../Logger/Logger.js";

class User {
  //core
  verifySupport(supportEmail: string, userId: string): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      return resolve(true);
    });
  }

  getUserById(id: string, locale = "pt-BR"): Promise<iUser> {
    return new Promise<iUser>((resolve, reject) => {
      Prisma.user
        .findUniqueOrThrow({
          where: {
            id,
          },
        })
        .then((user) => {
          resolve(user as iUser);
        })
        .catch(() => {
          reject(new errors.UserError(getMessage("userNotFound", locale)));
        });
    });
  }

  getUserByEmail(email: string, locale = "pt-BR"): Promise<iUser> {
    return new Promise<iUser>((resolve, reject) => {
      Prisma.user
        .findUniqueOrThrow({
          where: {
            email,
          },
        })
        .then((user) => {
          return resolve(user as iUser);
        })
        .catch((err) => {
          return reject(
            new errors.UserError(getMessage("userNotFound", locale))
          );
        });
    });
  }

  createNewUser(
    session: iSession,
    email: string,
    name: string,
    lastName: string,
    phone: string,
    passwd: string
  ): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const user = (await Prisma.user
        .create({
          data: {
            email,
            name,
            lastName,
            phone,
            passwd,
          },
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot create new User")
          );
        })) as iUser;

      const verification = await Verification.generate2faLink(
        user,
        session,
        "AUTHENTICATION"
      );

      await Verification.sendTransacionalEmail(user, verification);

      Logger.info(
        {
          user: user.id,
          email: user.email,
          sessionId: session.id,
        },
        "User created."
      );

      resolve(user);
    });
  }

  setEmailVerified(user: iUser, locale = "pt-BR"): Promise<iUser> {
    return new Promise((resolve, reject) => {
      Prisma.user
        .update({
          where: {
            id: user.id,
          },
          data: {
            emailVerified: true,
          },
        })
        .then((user) => {
          resolve(user as iUser);
        })
        .catch(() => {
          reject(new errors.InternalServerError("Erro ao atualizar usuário."));
        });
    });
  }
}

export default new User();
