//db
import prisma from "../../controllers/db.controller.js";

//errors & response
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

//types
import { User as iUser, Session as iSession } from "@prisma/client";

//core
import Verification from "../Verification/Verification.js";

class Authentication {
  //core
  verifySupport(supportEmail: string, userId: string): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      return resolve(true);
    });
  }

  getUserById(id: string): Promise<iUser> {
    return new Promise<iUser>((resolve, reject) => {
      prisma.user
        .findUniqueOrThrow({
          where: {
            id,
          },
        })
        .then((user) => {
          resolve(user as iUser);
        })
        .catch(() => {
          reject(new errors.UserError(response.userNotFound()));
        });
    });
  }

  getUserByEmail(email: string): Promise<iUser> {
    return new Promise<iUser>((resolve, reject) => {
      prisma.user
        .findUniqueOrThrow({
          where: {
            email,
          },
        })
        .then((user) => {
          return resolve(user as iUser);
        })
        .catch((err) => {
          return reject(new errors.UserError(response.userNotFound()));
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
      const user = (await prisma.user
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

      const verification = await Verification.generate2faLink(user, session);

      await Verification.sendWelcomeMessage(user, verification.token);

      resolve(user);
    });
  }

  setEmailVerified(user: iUser, locale = "pt-BR"): Promise<iUser> {
    return new Promise((resolve, reject) => {
      prisma.user
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

export default new Authentication();
