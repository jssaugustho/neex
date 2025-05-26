//db
import prisma from "../../controllers/db.controller.js";

import {
  User as iUser,
  Session as iSession,
  Attempt as iAttempt,
  Ip as iIp,
} from "@prisma/client";

//errors
import errors from "../../errors/errors.js";
import { getMessage } from "../../locales/getMessage.js";

//observers
import IncrementSessionAttempts from "../../observers/SessionAttempts/IncrementSessionAttempts.js";

//types
import iObserver from "../../@types/iObserver/iObserver.js";
import iSubject from "../../@types/iSubject/iSubject.js";
import iLookup from "../../@types/iLookup/iLookup.js";
import iSessionPayload from "../../@types/iSessionPayload/iSessionPayload.js";

//external libs
import { UAParser } from "ua-parser-js";
import { create } from "domain";
import { ad } from "google-ads-api/build/src/protos/autogen/resourceNames.js";
import Ip from "../Ip/Ip.js";
import { connect } from "http2";

class Session implements iSubject {
  observers: iObserver[] = [];

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

  createSession(
    fingerprint: string,
    ip: iIp,
    userAgent: string,
    locale: string,
    timeZone?: string
  ): Promise<iSessionPayload> {
    return new Promise(async (resolve, reject) => {
      let data: any = {
        ip: {
          connect: {
            id: ip.id,
          },
        },
        fingerprint,
        locale,
        userAgent,
        timeZone: timeZone || ip.timeZone,
        name: this.getDeviceNameFromUA(userAgent),
      };

      const session = await prisma.session
        .create({
          data: {
            ip: {
              connect: {
                id: ip.id,
              },
            },
            fingerprint,
            locale,
            userAgent,
            timeZone: timeZone || ip.timeZone,
            name: this.getDeviceNameFromUA(userAgent),
          },
          include: {
            ip: true,
          },
        })
        .then((session) => {
          return resolve(session as iSessionPayload);
        })
        .catch((err) => {
          console.log(err);
          return reject(
            new errors.InternalServerError("Cannot create new session in DB.")
          );
        });
    });
  }

  sessionIdentifier(
    fingerprint: string,
    ip: iIp,
    userAgent: string,
    timeZone: string,
    locale: string,
    sessionId?: string
  ): Promise<iSessionPayload> {
    return new Promise(async (resolve, reject) => {
      if (sessionId) {
        let session = (await prisma.session
          .findUniqueOrThrow({
            where: {
              id: sessionId,
              fingerprint: fingerprint,
            },
            include: {
              ip: true,
            },
          })
          .catch((err) => {
            return reject(
              new errors.AuthError(getMessage("invalidSession", locale))
            );
          })) as iSessionPayload;

        session = (await prisma.session
          .update({
            where: {
              id: session.id,
            },
            data: {
              lastActivity: new Date(),
              userAgent,
              locale,
              timeZone,
            },
            include: {
              ip: true,
            },
          })
          .catch(() => {
            return reject(
              new errors.InternalServerError("Cannot update session in DB.")
            );
          })) as iSessionPayload;

        return resolve(session);
      } else {
        let session = (await prisma.session.findFirst({
          where: {
            fingerprint: fingerprint,
          },
          orderBy: {
            updatedAt: "desc",
          },
          include: {
            ip: true,
          },
        })) as iSessionPayload;

        if (!session) {
          session = (await this.createSession(
            fingerprint,
            ip,
            userAgent,
            locale,
            timeZone
          ).catch((err) => {
            return reject(err);
          })) as iSessionPayload;
        }

        if (session.ipId !== ip.id) {
          session = (await this.createSession(
            fingerprint,
            ip,
            userAgent,
            locale,
            timeZone
          ).catch((err) => {
            return reject(err);
          })) as iSessionPayload;
        }

        await prisma.session
          .update({
            where: {
              id: session.id,
            },
            data: {
              lastActivity: new Date(),
              userAgent,
              locale,
              timeZone,
            },
            include: {
              ip: true,
            },
          })
          .catch(() => {
            return reject(
              new errors.InternalServerError("Cannot update session in DB.")
            );
          });

        return resolve(session as iSessionPayload);
      }
    });
  }

  sessionSecurityVerification(
    user: iUser,
    session: iSessionPayload
  ): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      let authorized = false;

      const attemptsCheck = await Ip.verifyAttempts(session.ip, user);

      if (session.unauthorizedUsersId.includes(user.id)) return resolve(false);

      if (!attemptsCheck) return resolve(false);

      if (session.ip.authorizedUsersId.includes(user.id)) {
        return resolve(true);
      }

      const fingerprintSessions = (await prisma.session
        .findMany({
          where: {
            fingerprint: session.fingerprint,
            ip: {
              authorizedUsersId: {
                has: user.id,
              },
            },
          },
          include: {
            ip: true,
          },
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot get sessions in DB.")
          );
        })) as iSessionPayload[];

      if (fingerprintSessions.length > 0) {
        authorized = true;
      }

      fingerprintSessions.forEach(async (session) => {
        const check = await Ip.verifyAttempts(session.ip, user);

        if (!check) authorized = false;
      });

      if (!authorized)
        this.notifyObserver(IncrementSessionAttempts, { user, session });

      return resolve(authorized);
    });
  }

  getAllUserSessions(userData: iUser): Promise<iSessionPayload[]> {
    return new Promise((resolve, reject) => {
      let query: object = {
        where: {
          authorizedUsers: {
            some: {
              id: userData.id,
            },
          },
        },
        include: {
          ip: true,
          attempts: true,
        },
      };

      prisma.session
        .findMany(query)
        .then((results) => {
          return resolve(results as iSessionPayload[]);
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot find sessions in DB.")
          );
        });
    });
  }

  getSessionById(
    sessionId: string,
    locale: string,
    userData?: iUser
  ): Promise<iSessionPayload> {
    return new Promise((resolve, reject) => {
      let query: { id: string; userId?: string } = {
        id: sessionId,
      };

      if (userData) query.userId = userData.id;

      prisma.session
        .findUniqueOrThrow({
          where: query,
          include: {
            ip: true,
          },
        })
        .then((result) => {
          return resolve(result as iSessionPayload);
        })
        .catch(() => {
          return reject(
            new errors.UserError(getMessage("sessionNotFound", locale))
          );
        });
    });
  }

  logoutSession(session: iSession, user: iUser): Promise<iSession | null> {
    return new Promise(async (resolve, reject) => {
      let data: any = {
        token: "",
        refreshToken: "",
        userId: null,
      };

      await prisma.session
        .update({
          where: {
            id: session.id,
          },
          data,
        })
        .then((session) => {
          if (session) return resolve(session);

          return resolve(null);
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot inactive session in DB.")
          );
        });
    });
  }

  logoutAllUserSessions(
    userData: iUser,
    exception?: iSession
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      let query: any = {
        userId: userData.id,
      };

      if (exception)
        query = {
          userId: userData.id,
          NOT: [{ id: exception.id }],
        };

      const userSessions = (await prisma.session
        .findMany({
          where: query,
        })
        .catch(() => {
          return reject(
            new errors.InternalServerError("Cannot inactivate sessions. 1")
          );
        })) as iSession[];

      userSessions.forEach(async (session) => {
        await prisma.session
          .update({
            where: {
              id: session.id,
            },
            data: {
              user: {
                disconnect: true,
              },
              token: "",
              refreshToken: "",
            },
          })
          .catch(() => {
            return reject(
              new errors.InternalServerError(
                "Cannot update session: " + session.id
              )
            );
          });
      });

      return resolve(userSessions.length);
    });
  }

  blockSession(session: iSession, user: iUser): Promise<iSession | null> {
    return new Promise(async (resolve, reject) => {
      let data: any = {
        token: "",
        refreshToken: "",
        userId: null,
        unauthorizedUsers: {
          connect: {
            id: user.id,
          },
        },
      };

      await prisma.session
        .update({
          where: {
            id: session.id,
          },
          data,
        })
        .then((session) => {
          if (session) return resolve(session);

          return resolve(null);
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot inactive session in DB.")
          );
        });
    });
  }

  blockAllUserSessions(userData: iUser, exception?: iSession): Promise<number> {
    return new Promise(async (resolve, reject) => {
      let query: any = {
        userId: userData.id,
      };

      if (exception)
        query = {
          userId: userData.id,
          NOT: [{ id: exception.id }],
        };

      const userSessions = (await prisma.session
        .findMany({
          where: query,
        })
        .catch(() => {
          return reject(
            new errors.InternalServerError("Cannot inactivate sessions. 1")
          );
        })) as iSession[];

      userSessions.forEach(async (session) => {
        await prisma.session
          .update({
            where: {
              id: session.id,
            },
            data: {
              user: {
                disconnect: true,
              },
              token: "",
              refreshToken: "",
              unauthorizedUsers: {
                connect: {
                  id: userData.id,
                },
              },
            },
          })
          .catch(() => {
            return reject(
              new errors.InternalServerError(
                "Cannot update session: " + session.id
              )
            );
          });
      });

      return resolve(userSessions.length);
    });
  }

  isActive(session: iSession) {
    if (!session?.userId) return false;
    if (!session?.token) return false;
    if (!session?.refreshToken) return false;

    return true;
  }

  getDeviceNameFromUA(userAgent: string): string {
    const parser = new UAParser(userAgent);

    const result = parser.getResult();

    const deviceType = result.device.type || "desktop"; // mobile, tablet, smarttv, wearable, embedded
    const osName = result.os.name || "SO Desconhecido";
    const browserName = result.browser.name || "Browser Desconhecido";
    const browserVersion = result.browser.version?.split(".")[0] || "";

    let deviceEmoji = "🖥️"; // Default desktop
    if (deviceType === "mobile") deviceEmoji = "📱";
    else if (deviceType === "tablet") deviceEmoji = "📱";
    else if (deviceType === "smarttv") deviceEmoji = "📺";
    else if (deviceType === "wearable") deviceEmoji = "⌚";

    return `${deviceEmoji} ${osName} / ${browserName}`;
  }
}

export default new Session();
