import React from "react";

//errors & response
import errors from "../../errors/errors.js";
import { getMessage } from "../../locales/getMessage.js";

//types
import {
  User as iUser,
  Session as iSession,
  Passwd as iPasswd,
} from "@prisma/client";

//core
import Verification from "../Verification/Verification.js";

import Prisma from "../Prisma/Prisma.js";
import Logger from "../Logger/Logger.js";
import Email from "../Email/Email.js";
import EmailVerified from "../Email/models/EmailVerified.js";
import VerificationEmail from "../Email/models/VerificationEmail.js";
import AuthenticationEmail from "../Email/models/AuthenticationEmail.js";
import iSessionPayload from "../../@types/iSessionPayload/iSessionPayload.js";
import PasswdType from "../../types/PasswdType/PasswdType.js";
import Cryptography from "../Cryptography/Cryptography.js";

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
            new errors.UserError(getMessage("userNotFound", locale)),
          );
        });
    });
  }

  getActivePasswd(user: iUser, locale = "pt-BR"): Promise<iPasswd> {
    return new Promise<iPasswd>((resolve, reject) => {
      Prisma.passwd
        .findFirstOrThrow({
          where: {
            userId: user.id,
            active: true,
          },
        })
        .then((passwd) => {
          return resolve(passwd as iPasswd);
        })
        .catch((err) => {
          return reject(
            new errors.UserError(getMessage("userNotFound", locale)),
          );
        });
    });
  }

  createNewUser(
    session: iSessionPayload,
    email: string,
    name: string,
    lastName: string,
    phone: string,
    passwd: string,
    gender: "Male" | "Female" | "Other",
    log = true,
  ): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const user = (await Prisma.user
        .create({
          data: {
            email,
            name,
            lastName,
            phone,
            passwd: {
              create: {
                active: true,
                hash: passwd,
                session: {
                  connect: {
                    id: session.id,
                  },
                },
              },
            },
            gender,
            locale: session.locale,
            timeZone: session.timeZone,
          },
        })
        .catch(() => {
          return reject(
            new errors.InternalServerError("Cannot create new User"),
          );
        })) as iUser;

      const verification = await Verification.generate2faLink(
        user,
        session,
        "WELCOME_EMAIL",
      );

      await Verification.sendTransacionalEmail(
        user,
        verification,
        session,
        false,
      );

      if (log)
        Logger.info(
          {
            user: user.id,
            email: user.email,
            sessionId: session.id,
          },
          "User created.",
        );

      resolve(user);
    });
  }

  changePassword(
    user: iUser,
    newHash: string,
    session: iSessionPayload,
    locale = "pt-BR",
  ): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const passwd = await Prisma.passwd.updateMany({
        where: {
          userId: user.id,
          active: true,
        },
        data: {
          active: false,
        },
      });

      const userUpdated = await Prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwd: {
            create: {
              active: true,
              session: {
                connect: {
                  id: session.id,
                },
              },
              hash: newHash,
            },
          },
        },
      });

      return resolve(userUpdated);
    });
  }

  setEmailVerified(user: iUser, locale = "pt-BR"): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
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

      await Email.sendTransacionalEmail(
        user.email,
        "Email verificado com sucesso | Neex Club",
        <EmailVerified user={user} />,
      );
    });
  }
}

export default new User();
