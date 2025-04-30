//db
import prisma from "../../controllers/db.controller.js";

import { User as iUser, Session as iSession } from "@prisma/client";

//errors
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

//observers
import IncrementSessionAttempts from "../../observers/SessionAttempts/IncrementSessionAttempts.js";

//types
import iObserver from "../../@types/iObserver/iObserver.js";
import iSubject from "../../@types/iSubject/iSubject.js";
import iLookup from "../../@types/iLookup/iLookup.js";

//external libs
import iSessionAttempts from "../../@types/iSessionAttempt/iSessionAttempt.js";
import { UAParser } from "ua-parser-js";
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
    address: iLookup,
    userAgent: string,
    attempts?: object,
    authorizedUsers?: string[]
  ): Promise<iSession> {
    return new Promise(async (resolve, reject) => {
      let data: any = {
        ip: address.ip,
        location: address.location as object,
        fingerprint,
        name: this.getDeviceNameFromUA(userAgent),
      };
      if (authorizedUsers) {
        data.authorizedUsers = {
          connect: [],
        };

        data.authorizedUsers.connect = authorizedUsers.map((atual: string) => {
          return { id: atual };
        });
      }
      if (attempts) data.attempts = attempts;

      await prisma.session
        .create({
          data,
        })
        .then((session) => {
          return resolve(session);
        })
        .catch((err) => {
          console.log(err);
          return reject(
            new errors.InternalServerError("Cannot create new session in DB.")
          );
        });
    });
  }

  identifySession(
    fingerprint: string,
    address: iLookup,
    userAgent: string,
    sessionId?: string
  ): Promise<iSession> {
    return new Promise(async (resolve, reject) => {
      if (sessionId) {
        let session = (await prisma.session
          .findUniqueOrThrow({
            where: {
              id: sessionId,
              OR: [
                { fingerprint },
                {
                  ip: address.ip,
                },
              ],
            },
          })
          .catch((err) => {
            return reject(new errors.AuthError(response.invalidSession()));
          })) as iSession;

        await prisma.session
          .update({
            where: {
              id: session.id,
            },
            data: {
              lastActivity: new Date(),
            },
          })
          .catch(() => {
            return reject(
              new errors.InternalServerError("Cannot update session in DB.")
            );
          });

        return resolve(session);
      } else {
        let ipSessions = await prisma.session.findMany({
          where: {
            OR: [
              { ip: address.ip },
              {
                fingerprint: fingerprint,
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });

        let winnerSession: iSession | null = null;
        let attempts = {};
        let authorizedUsers: string[] = [];

        ipSessions.forEach(async (session) => {
          if (
            session.fingerprint === fingerprint &&
            session.ip === address.ip &&
            !winnerSession
          ) {
            winnerSession = session;
            return;
          }

          if (session.ip === address.ip) {
            attempts = {
              ...attempts,
              ...(session.attempts as object),
            };
            authorizedUsers = authorizedUsers.concat(session.authorizedUsersId);
          }
        });

        if (!winnerSession) {
          winnerSession = (await this.createSession(
            fingerprint,
            address,
            userAgent,
            attempts,
            authorizedUsers
          ).catch((err) => {
            return reject(err);
          })) as iSession;
        }

        await prisma.session
          .update({
            where: {
              id: winnerSession.id,
            },
            data: {
              lastActivity: new Date(),
            },
          })
          .catch(() => {
            return reject(
              new errors.InternalServerError("Cannot update session in DB.")
            );
          });

        return resolve(winnerSession);
      }
    });
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

  verifySessionAuthorization(
    user: iUser,
    session: iSession,
    allowFingerprint = true
  ): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      let authorized = false;

      let where: object = {
        ip: session.ip,
      };

      if (!allowFingerprint)
        where = {
          OR: [
            {
              ip: session.ip,
            },
            {
              fingerprint: session.fingerprint,
            },
          ],
        };

      const sessions = (await prisma.session
        .findMany({
          where,
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot get sessions in DB.")
          );
        })) as iSession[];

      sessions.forEach((session) => {
        if (
          this.verifyAttempts(session, user) &&
          session.authorizedUsersId.includes(user.id)
        )
          authorized = true;
      });

      if (!authorized)
        this.notifyObserver(IncrementSessionAttempts, { user, session });

      return resolve(authorized);
    });
  }

  getAllUserSessions(userData: iUser): Promise<iSession[]> {
    return new Promise((resolve, reject) => {
      let query: object = {
        where: {
          authorizedUsers: {
            some: {
              id: userData.id,
            },
          },
        },
      };

      prisma.session
        .findMany(query)
        .then((results) => {
          return resolve(results);
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot find sessions in DB.")
          );
        });
    });
  }

  getSessionById(sessionId: string, userData?: iUser): Promise<iSession> {
    return new Promise((resolve, reject) => {
      let query: { id: string; userId?: string } = {
        id: sessionId,
      };

      if (userData) query.userId = userData.id;

      prisma.session
        .findUniqueOrThrow({
          where: query,
        })
        .then((result) => {
          return resolve(result);
        })
        .catch(() => {
          return reject(new errors.UserError(response.sessionNotFound()));
        });
    });
  }

  inactivateSession(session: iSession, user: iUser): Promise<iSession | null> {
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

  inactivateAllUserSessions(
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

  blockAllUserSessions(
    userData: iUser,
    exception?: iSession,
    block = false
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      let query: any = {
        authorizedUsersId: { has: userData.id },
      };

      if (exception)
        query = {
          authorizedUsersId: { has: userData.id },
          NOT: [{ id: exception.id }],
        };

      const sessions = (await prisma.session
        .findMany({
          where: query,
        })
        .catch((err) => {
          reject(new errors.InternalServerError("Cannot inactivate sessions."));
        })) as iSession[];

      sessions.forEach(async (session) => {
        await prisma.session
          .update({
            where: {
              id: session.id,
            },
            data: {
              authorizedUsers: {
                disconnect: { id: userData.id },
              },
              user: {
                disconnect: true,
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

      return resolve(sessions.length);
    });
  }

  blockSession(session: iSession, user: iUser): Promise<iSession | null> {
    return new Promise(async (resolve, reject) => {
      let data: any = {
        token: "",
        refreshToken: "",
        user: {
          disconnect: {
            id: user.id,
          },
        },
        authorizedUsers: {
          set: [],
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

  isActive(session: iSession) {
    if (!session?.userId) return false;
    if (!session?.token) return false;
    if (!session?.refreshToken) return false;

    return true;
  }

  verifyAttempts(session: iSession, user: iUser) {
    let attempts = session?.attempts as object as iSessionAttempts;

    if (
      attempts[user.id] &&
      Date.now() - attempts[user.id].timeStamp < 10 * 1000 * 60 &&
      attempts[user.id].attempts >= 10
    )
      return false;

    return true;
  }
}

export default new Session();
