//types
import {
  User as iUser,
  Session as iSession,
  Verification as iVerification,
} from "@prisma/client";
import iObserver from "../../@types/iObserver/iObserver.js";
import iSubject from "../../@types/iSubject/iSubject.js";

//db
import prisma from "../../controllers/db.controller.js";

//external libs
import jwt from "jsonwebtoken";
import SendVerificationCode from "../../observers/VerificationCode/SendVerificationCode.js";
import Token from "../Token/Token.js";
import errors from "../../errors/errors.js";
import response from "../../response/response.js";
import User from "../User/User.js";
import { rejects } from "assert";

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

  async notify(data?: { user: iUser; token: string }) {
    this.observers.forEach((observer) => observer.update(data));
  }

  notifyObserver(observer: iObserver, data?: any) {
    observer.update(data);
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
      const verification = await prisma.verification.findUnique({
        where: {
          userId: user.id,
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
    session: iSession
  ): Promise<iVerification> {
    return new Promise(async (resolve, reject) => {
      const token = jwt.sign(
        {
          id: user.id,
          sessionId: session.id,
          type: "Email2fa",
        },
        process.env.JWT_VERIFICATION_SECRET as string,
        {
          expiresIn: 1000 * 60 * 5,
        }
      );

      let check = (await prisma.verification
        .findUnique({
          where: {
            userId: user.id,
          },
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot get verification in DB.")
          );
        })) as iVerification;

      if (!check) {
        check = (await prisma.verification.create({
          data: {
            token,
            used: false,
            session: {
              connect: {
                id: session.id,
              },
            },
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        })) as iVerification;
      } else {
        await prisma.verification.update({
          where: {
            userId: user.id,
          },
          data: {
            token,
            used: false,
            session: {
              connect: {
                id: session.id,
              },
            },
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      }

      await this.notify({
        user,
        token,
      });

      resolve(check);
    });
  }

  async verifyLastAttempt(user: iUser): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      let verification = await prisma.verification
        .findUnique({
          where: {
            userId: user.id,
          },
        })
        .catch(() => {
          throw new errors.InternalServerError(
            "Cannot get verification in DB."
          );
        });

      if (!verification) return resolve(true);

      let lastAttempt = new Date(verification.updatedAt).getTime();

      if (lastAttempt > Date.now() - 60 * 1000 * 60) return reject(false);

      return resolve(true);
    });
  }

  async verify2faToken(token: string, session: iSession): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const error = new errors.AuthError(response.invalidEmailToken());
      const payload = await Token.loadPayload(token, "emailToken").catch(
        (err) => {
          return reject(err);
        }
      );

      if (!payload) return reject(error);

      if (payload.sessionId !== session.id) return reject(error);

      if (!payload.id) return reject(error);

      const user = (await User.getUserById(payload.id).catch((err) => {
        return reject(error);
      })) as iUser;

      let verification = (await prisma.verification
        .findUniqueOrThrow({
          where: {
            userId: user.id,
          },
        })
        .catch(() => {
          return reject(error);
        })) as iVerification;

      if (verification.token !== token || verification.used)
        return reject(error);

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
          return reject(error);
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
          return reject(error);
        });

      return resolve(user);
    });
  }
}

export default new Verification();
