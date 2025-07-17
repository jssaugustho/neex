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

class Verification {
  async notificateEmailVerified(user: iUser) {
    return await Email.sendTransacionalEmail(
      user.email,
      "Email Verificado Com Sucesso | Lux CRM ©",
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
      | "AUTHENTICATION"
      | "PRE_AUTHENTICATION"
      | "VERIFICATION"
      | "RECOVERY"
      | "VERIFY_SESSION"
      | "SET_NEW_PASSWD",
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
          expiresIn: 1000 * 60 * 5,
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
  ): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const payload = await Token.loadPayload(token, "emailToken").catch(
        (err) => {
          return reject(err);
        },
      );

      if (!payload)
        return reject(
          new errors.AuthError(getMessage("invalidToken", session.locale)),
        );

      if (!payload.id)
        return reject(
          new errors.AuthError(getMessage("invalidToken", session.locale)),
        );

      if (!payload.type)
        return reject(
          new errors.AuthError(getMessage("invalidToken", session.locale)),
        );

      if (!payload.sessionId)
        return reject(
          new errors.AuthError(getMessage("invalidToken", session.locale)),
        );

      const user = (await User.getUserById(payload.id).catch((err) => {
        return reject(
          new errors.AuthError(getMessage("invalidToken", session.locale)),
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
          new errors.AuthError(getMessage("invalidToken", session.locale)),
        );

      if (verification?.token !== token || verification.used)
        return reject(
          new errors.AuthError(getMessage("invalidToken", session.locale)),
        );

      if (payload.sessionId !== session.id && unique)
        return reject(
          new errors.AuthError(getMessage("invalidToken", session.locale)),
        );

      if (!authorizedTypes.includes(payload.type))
        return reject(
          new errors.AuthError(getMessage("invalidToken", session.locale)),
        );

      verification = (await Prisma.verification
        .update({
          where: {
            id: verification.id,
          },
          data: {
            used: true,
          },
        })
        .catch(() => {
          return reject(
            new errors.AuthError(getMessage("invalidToken", session.locale)),
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
            new errors.AuthError(getMessage("invalidToken", session.locale)),
          );
        });

      return resolve(user);
    });
  }

  async sendTransacionalEmail(
    user: iUser,
    verification: iVerification,
    session: iSessionPayload,
  ) {
    const emailModel =
      verification.type === "AUTHENTICATION" ? (
        <AuthenticationEmail token={verification.token} user={user} />
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
      verification.type === "AUTHENTICATION"
        ? "Faça o seu login via email | Lux CRM ©"
        : verification.type === "RECOVERY"
          ? "Redefina a sua senha | Lux CRM ©"
          : verification.type === "VERIFY_SESSION"
            ? "Autorize um novo dispositivo | Lux CRM ©"
            : "Verifique o seu email | Lux CRM ©";

    return await Email.sendTransacionalEmail(
      user.email,
      subject,
      emailModel,
    ).catch((err) => {
      console.log(err);
    });
  }

  async sendWelcomeMessage(user: iUser, emailToken: string) {
    return await Email.sendTransacionalEmail(
      user.email,
      "Verifique seu email | Lux CRM ©",
      <WelcomeMessage token={emailToken} user={user} />,
    ).catch((err) => {
      console.log(err);
    });
  }
}

export default new Verification();
