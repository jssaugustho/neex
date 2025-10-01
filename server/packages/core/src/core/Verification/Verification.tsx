//types
import {
  User as iUser,
  Session as iSession,
  Verification as iVerification,
} from "@prisma/client";

//external libs
import jwt from "jsonwebtoken";
import errors from "../../errors/errors.js";
import { getMessage } from "../../locales/getMessage.js";

import Token from "../Token/Token.js";
import User from "../User/User.js";
import Email from "../Email/Email.js";

//email models
import React from "react";
import WelcomeMessage from "../Email/models/WelcomeMessage.js";
import EmailVerified from "../Email/models/EmailVerified.js";
import AuthenticationEmail from "../Email/models/AuthenticationEmail.js";
import RecoveryEmail from "../Email/models/RecoveryEmail.js";
import VerificationEmail from "../Email/models/VerificationEmail.js";

import Prisma from "../Prisma/Prisma.js";
import VerifySessionEmail from "../Email/models/VerifySessionEmail.js";
import iSessionPayload from "../../@types/iSessionPayload/iSessionPayload.js";
import Logger from "../Logger/Logger.js";

class Verification {
  async notificateEmailVerified(user: iUser) {
    return await Email.sendTransacionalEmail(
      user.email,
      "Email Verificado Com Sucesso | Neex Club ©",
      <EmailVerified user={user} />,
    ).catch((err) => {
      console.log(err);
    });
  }

  getExponencialTime(session: iSession) {
    const exponencialList = [3, 5, 5, 5, 10, 10, 10, 20, 20, 20, 60, 60 * 3];

    let exponencialValue =
      exponencialList[
        session.exponencialEmailExpires <= 11
          ? session.exponencialEmailExpires
          : 11
      ] * 60000;

    return exponencialValue;
  }

  async getTimeLeft(session: iSession, user: iUser): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const verification = await Prisma.verification.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (!verification || session.exponencialEmailExpires < 0)
        return resolve(0);

      const TimePassed =
        Date.now() - new Date(verification.updatedAt).getTime();

      let exponencialValue = this.getExponencialTime(session);

      return resolve(exponencialValue - TimePassed);
    });
  }

  async generate2faLink(
    user: iUser,
    session: iSession,
    type:
      | "WELCOME_EMAIL"
      | "PRE_AUTHENTICATION"
      | "VERIFICATION"
      | "RECOVERY"
      | "VERIFY_SESSION"
      | "SET_NEW_PASSWD"
      | "LOGOUT_ALL_SESSIONS"
      | "LOGOUT_SESSION",
    unique = false,
  ): Promise<iVerification> {
    return new Promise(async (resolve, reject) => {
      const token = jwt.sign(
        {
          id: user.id,
          sessionId: session.id,
          type,
          unique,
        },
        process.env.JWT_VERIFICATION_SECRET as string,
        {
          expiresIn: 1000 * 60 * 10,
        },
      );

      let verification = (await Prisma.verification.create({
        data: {
          token,
          type,
          used: false,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      })) as iVerification;

      resolve(verification);
    });
  }

  async verifyEmailToken(
    token: string,
    session: iSession,
    authorizedTypes: string[],
    auth = false,
    unique = false,
    invalidate = true,
  ): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const payload = await Token.loadPayload(token, "emailToken").catch(
        (err) => {
          return reject(err);
        },
      );

      if (!payload)
        return reject(
          new errors.AuthError(
            getMessage("invalidTokenPayload", session.locale, {
              lost: "Payload",
            }),
          ),
        );

      if (!payload.id)
        return reject(
          new errors.AuthError(
            getMessage("invalidTokenPayload", session.locale, {
              lost: "Payload ID",
            }),
          ),
        );

      if (!payload.type)
        return reject(
          new errors.AuthError(
            getMessage("invalidTokenPayload", session.locale, {
              lost: "Payload Type",
            }),
          ),
        );

      if (!payload.sessionId)
        return reject(
          new errors.AuthError(
            getMessage("invalidTokenPayload", session.locale, {
              lost: "Payload SessionID",
            }),
          ),
        );

      const user = (await User.getUserById(payload.id).catch((err) => {
        return reject(
          new errors.AuthError(getMessage("userNotFound", session.locale)),
        );
      })) as iUser;

      let verification = await Prisma.verification.findFirst({
        where: {
          userId: user.id,
          token,
          type: payload.type,
        },
      });

      if (!verification)
        return reject(
          new errors.AuthError(
            getMessage("verificationTokenNotFound", session.locale),
          ),
        );

      if (verification?.token !== token || verification.used)
        return reject(
          new errors.AuthError(
            getMessage("invalidVerificationToken", session.locale),
          ),
        );

      if (payload.sessionId !== session.id && unique)
        return reject(
          new errors.AuthError(getMessage("invalidSession", session.locale)),
        );

      if (!authorizedTypes.includes(payload.type))
        return reject(
          new errors.AuthError(
            getMessage("invalidVerificationTokenType", session.locale, {
              type: payload.type,
            }),
          ),
        );

      verification = (await Prisma.verification
        .update({
          where: {
            id: verification.id,
          },
          data: {
            used: invalidate,
          },
        })
        .catch(() => {
          return reject(
            new errors.InternalServerError(
              "Can't update verification token in database.",
            ),
          );
        })) as iVerification;

      await Prisma.session
        .update({
          where: {
            id: session.id,
          },
          data: {
            exponencialEmailExpires: -1,
          },
        })
        .catch(() => {
          return reject(
            new errors.InternalServerError("Can't update session in database."),
          );
        });

      return resolve(user);
    });
  }

  async sendTransacionalEmail(
    user: iUser,
    verification: iVerification,
    session: iSessionPayload,
    log = true,
  ) {
    const emailModel =
      verification.type === "WELCOME_EMAIL" ? (
        <WelcomeMessage token={verification.token} user={user} />
      ) : verification.type === "RECOVERY" ? (
        <RecoveryEmail token={verification.token} user={user} />
      ) : verification.type === "VERIFY_SESSION" ? (
        <VerifySessionEmail
          token={verification.token}
          session={session}
          user={user}
        />
      ) : (
        <VerificationEmail token={verification.token} user={user} />
      );

    const subject =
      verification.type === "WELCOME_EMAIL"
        ? "Seja bem vindo | Neex Club ©"
        : verification.type === "RECOVERY"
          ? "Redefina a sua senha | Neex Club ©"
          : verification.type === "VERIFY_SESSION"
            ? "Autorize um novo dispositivo | Neex Club ©"
            : "Verifique o seu email | Neex Club ©";

    return await Email.sendTransacionalEmail(
      user.email,
      subject,
      emailModel,
      log,
    ).catch((err) => {
      console.log(err);
    });
  }

  async sendWelcomeMessage(user: iUser, emailToken: string) {
    return await Email.sendTransacionalEmail(
      user.email,
      "Verifique seu email | Neex Club ©",
      <WelcomeMessage token={emailToken} user={user} />,
    ).catch((err) => {
      console.log(err);
    });
  }
}

export default new Verification();
