//types
import iObserver from "../../@types/iObserver/iObserver.js";
import {
  User as iUser,
  Session as iSession,
  Verification as iVerification,
} from "@prisma/client";
import iSubject from "../../@types/iSubject/iSubject.js";
import iTokenPayload from "../../@types/iTokenPayload/iTokenPayload.js";

//external libs
import prisma from "../../controllers/db.controller.js";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

//core
import Token from "../Token/Token.js";
import Session from "../Session/Session.js";

//errors
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

//observers
import EmailVerified from "../../observers/NotificateUser/EmailVerified.js";
import SendVerificationCode from "../../observers/VerificationCode/SendVerificationCode.js";
import ResetSessionAttempts from "../../observers/EmailExpires/ResetEmailExpires.js";
import IncrementEmailExpires from "../../observers/EmailExpires/IncrementEmailExpires.js";
import IncrementSessionAttempts from "../../observers/SessionAttempts/IncrementSessionAttempts.js";
import iLookup from "../../@types/iLookup/iLookup.js";

class Verification implements iSubject {
  observers: iObserver[] = [];

  constructor() {
    this.registerObserver(SendVerificationCode);
  }

  //observer functions
  registerObserver(observer: iObserver) {
    this.observers.push(observer);
  }

  removeObserver(observer: iObserver) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data?: { user: iUser; token: string }) {
    this.observers.forEach((observer) => observer.update(data));
  }

  notifyObserver(observer: iObserver, data?: any) {
    observer.update(data);
  }

  generateEmailToken(user: iUser, session: iSession): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const token = jwt.sign(
        {
          id: user.id,
          sessionId: session.id,
          rand: randomUUID(),
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 1000 * 60 * 10,
        }
      );

      const verification = await prisma.verification.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!verification)
        await prisma.verification.create({
          data: {
            used: false,
            token,
            user: {
              connect: {
                id: user.id,
              },
            },
            session: {
              connect: {
                id: session.id,
              },
            },
          },
        });
      else
        await prisma.verification.update({
          where: { id: verification.id },
          data: {
            used: false,
            token,
            user: {
              connect: {
                id: user.id,
              },
            },
            session: {
              connect: {
                id: session.id,
              },
            },
          },
        });

      this.notifyObserver(IncrementEmailExpires, { session });
      this.notify({ user, token });

      return resolve(token);
    });
  }

  verifyEmailToken(
    token: string,
    user: iUser,
    fingerprint: string,
    adddres: iLookup,
    showNotify = true
  ): Promise<iVerification> {
    return new Promise(async (resolve, reject) => {
      const decoded: iTokenPayload = await Token.loadPayload(
        token,
        "emailToken"
      ).catch((err) => {
        reject(err);
        return {};
      });

      if (!decoded) reject(new errors.AuthError(response.invalidToken()));

      const session = await Session.getSessionById(
        decoded.sessionId as string
      ).catch((err) => {
        return reject(new errors.AuthError(response.invalidToken()));
      });

      const loadedToken = await prisma.verification
        .findUniqueOrThrow({
          where: {
            userId: decoded.id,
            sessionId: decoded.sessionId,
            used: false,
            token,
          },
        })
        .catch((err) => {
          this.notifyObserver(IncrementSessionAttempts, {
            session,
          });
          return reject(new errors.AuthError(response.invalidToken()));
        });

      if (showNotify) this.notifyObserver(EmailVerified, { user, session });

      await prisma.verification
        .update({
          where: {
            id: loadedToken?.id,
          },
          data: {
            used: true,
          },
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot update verification in db.")
          );
        });

      this.notifyObserver(ResetSessionAttempts, {
        session,
      });

      return resolve(loadedToken as iVerification);
    });
  }

  verifyTime(
    verification: iVerification,
    session: iSession
  ): {
    approved: boolean;
    time: number;
    prettyTime: string;
  } {
    const now = new Date(Date.now()).getTime();

    const updatedAt = new Date(verification.updatedAt).getTime();

    let interval = session.exponencialEmailExpires * 60 * 1000;

    if (session.exponencialEmailExpires > 16) interval = 16 * 60 * 1000;

    const elapsedTime = now - updatedAt;

    const waitTime = interval - elapsedTime;

    const minutes = Math.floor(waitTime / 60000);
    const seconds = Math.floor((waitTime % 60000) / 1000);

    return {
      approved: elapsedTime >= interval,
      time: waitTime,
      prettyTime: `${minutes}m ${seconds}s`,
    };
  }
}

export default new Verification();
