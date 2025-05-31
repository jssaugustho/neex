//types
import {
  User as iUser,
  Session as iSession,
  Verification as iVerification,
} from "@prisma/client";

//db
import prisma from "../../controllers/db.controller.js";

//external libs
import jwt from "jsonwebtoken";
import errors from "../../errors/errors.js";
import { getMessage } from "../../locales/getMessage.js";

import Token from "../Token/Token.js";
import User from "../User/User.js";
import Email from "../Email/Email.js";

//email models
import React from "react";
import VerifyEmail from "../Email/models/VerifyEmail.js";
import WelcomeMessage from "../Email/models/WelcomeMessage.js";
import EmailVerified from "../Email/models/EmailVerified.js";

class Verification {
  async notificateEmailVerified(user: iUser) {
    return await Email.sendEmail(
      user.email,
      "Email Verificado Com Sucesso | Lux CRM ©",
      <EmailVerified user={user} />
    ).catch((err) => {
      console.log(err);
    });
  }

  getExponencialTime(session: iSession) {
    const exponencialList = [
      1,
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
      60 * 24,
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
      const verification = await prisma.verification.findFirst({
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
    auth = false
  ): Promise<iVerification> {
    return new Promise(async (resolve, reject) => {
      const token = jwt.sign(
        {
          id: user.id,
          sessionId: session.id,
          type: auth ? "authentication" : "verification",
        },
        process.env.JWT_VERIFICATION_SECRET as string,
        {
          expiresIn: 1000 * 60 * 5,
        }
      );

      let verification = (await prisma.verification.create({
        data: {
          token,
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

  async sendVerificationCode(user: iUser, emailToken: string) {
    return await Email.sendEmail(
      user.email,
      "Verifique seu email | Lux CRM ©",
      <VerifyEmail token={emailToken} user={user} />
    ).catch((err) => {
      console.log(err);
    });
  }

  async sendWelcomeMessage(user: iUser, emailToken: string) {
    return await Email.sendEmail(
      user.email,
      "Verifique seu email | Lux CRM ©",
      <WelcomeMessage token={emailToken} user={user} />
    ).catch((err) => {
      console.log(err);
    });
  }

  async verifyEmailToken(
    token: string,
    session: iSession,
    userData?: iUser
  ): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const payload = await Token.loadPayload(token, "emailToken").catch(
        (err) => {
          return reject(err);
        }
      );

      if (!payload)
        return reject(
          new errors.AuthError(getMessage("invalidToken", session.locale))
        );

      if (!payload.id)
        return reject(
          new errors.AuthError(getMessage("invalidToken", session.locale))
        );

      const authorizedPayloadType = userData
        ? "authentication"
        : "verification";

      if (payload.type != authorizedPayloadType)
        return reject(
          new errors.AuthError(getMessage("invalidToken", session.locale))
        );

      const user =
        userData ||
        ((await User.getUserById(payload.id).catch((err) => {
          return reject(
            new errors.AuthError(getMessage("invalidToken", session.locale))
          );
        })) as iUser);

      let verification = (await prisma.verification
        .findFirstOrThrow({
          where: {
            userId: user.id,
            token,
          },
        })
        .catch(() => {
          return reject(
            new errors.AuthError(getMessage("invalidToken", session.locale))
          );
        })) as iVerification;

      if (verification.token !== token || verification.used)
        return reject(
          new errors.AuthError(getMessage("invalidToken", session.locale))
        );

      verification = (await prisma.verification
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
            new errors.AuthError(getMessage("invalidToken", session.locale))
          );
        })) as iVerification;

      await prisma.session
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
            new errors.AuthError(getMessage("invalidToken", session.locale))
          );
        });

      return resolve(user);
    });
  }
}

export default new Verification();
