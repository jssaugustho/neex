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
    const exponencialList = [
      1,
      2,
      2,
      5,
      10,
      15,
      30,
      45,
      60,
      90,
      60 * 3,
      60 * 12,
    ];

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
    type: "AUTHENTICATION" | "VERIFICATION" | "RECOVERY",
  ): Promise<iVerification> {
    return new Promise(async (resolve, reject) => {
      const token = jwt.sign(
        {
          id: user.id,
          sessionId: session.id,
          type,
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

  async sendTransacionalEmail(user: iUser, verification: iVerification) {
    const emailModel =
      verification.type === "AUTHENTICATION" ? (
        <AuthenticationEmail token={verification.token} user={user} />
      ) : verification.type === "RECOVERY" ? (
        <RecoveryEmail token={verification.token} user={user} />
      ) : (
        <VerificationEmail token={verification.token} user={user} />
      );

    const subject =
      verification.type === "AUTHENTICATION"
        ? "Faça o seu login via email | Lux CRM ©"
        : verification.type === "RECOVERY"
          ? "Redefina a sua senha | Lux CRM ©"
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

  async verifyEmailToken(
    token: string,
    session: iSession,
    userData?: iUser,
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

      if (payload.type)
        return reject(
          new errors.AuthError(getMessage("invalidToken", session.locale)),
        );

      const user =
        userData ||
        ((await User.getUserById(payload.id).catch((err) => {
          return reject(
            new errors.AuthError(getMessage("invalidToken", session.locale)),
          );
        })) as iUser);

      let verification = (await Prisma.verification
        .findFirstOrThrow({
          where: {
            userId: user.id,
            token,
            type: payload.type,
          },
        })
        .catch(() => {
          return reject(
            new errors.AuthError(getMessage("invalidToken", session.locale)),
          );
        })) as iVerification;

      if (verification.token !== token || verification.used)
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
}

export default new Verification();
