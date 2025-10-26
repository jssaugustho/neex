import { User as iUser, Session as iSession, Ip as iIp } from "@prisma/client";

//errors
import errors from "../../errors/errors.js";
import { getMessage } from "../../lib/getMessage.js";

//types
import iSessionPayload from "../../@types/iSessionPayload/iSessionPayload.js";

//external libs
import { UAParser } from "ua-parser-js";
import Ip from "../Ip/Ip.js";
import Prisma from "../Prisma/Prisma.js";
import Logger from "../Logger/Logger.js";

class Session {
  async incrementSessionAttempts(user: iUser, session: iSessionPayload) {
    return await Prisma.attempt
      .create({
        data: {
          ip: {
            connect: {
              id: session.ipId,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async resetSessionAttempts(user: iUser, session: iSessionPayload) {
    return await Prisma.attempt
      .updateMany({
        where: {
          ipId: session.ipId,
          userId: user.id,
        },
        data: {
          active: false,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }

  createSession(
    fingerprint: string,
    ip: iIp,
    userAgent: string,
    locale: string,
    timeZone?: string,
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

      const session = await Prisma.session
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
            new errors.InternalServerError("Cannot create new session in DB."),
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
    sessionId?: string,
  ): Promise<iSessionPayload> {
    return new Promise(async (resolve, reject) => {
      let session: iSessionPayload | null = null;

      if (sessionId) {
        session = (await Prisma.session.findUnique({
          where: {
            id: sessionId,
            fingerprint: fingerprint,
          },
          include: {
            ip: true,
          },
        })) as iSessionPayload;
      } else {
        session = (await Prisma.session.findFirst({
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
      }

      if (!session || session.ip.id !== ip.id) {
        session = (await this.createSession(
          fingerprint,
          ip,
          userAgent,
          locale,
          timeZone,
        ).catch((err) => {
          return reject(err);
        })) as iSessionPayload;
      }

      await Prisma.session
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
            new errors.InternalServerError("Cannot update session in DB."),
          );
        });

      Logger.info(
        {
          name: session.name,
          ip: session.ip.address,
          session: session.id,
          fingerprint: session.fingerprint,
        },
        "Identified session.",
      );

      return resolve(session as iSessionPayload);
    });
  }

  sessionSecurityVerification(
    user: iUser,
    session: iSessionPayload,
  ): Promise<iSessionPayload> {
    return new Promise(async (resolve, reject) => {
      const attemptsCheck = await Ip.verifyAttempts(session.ip, user);

      if (session.unauthorizedUsersId.includes(user.id)) {
        this.incrementSessionAttempts(user, session);
        return reject(new errors.SessionError(getMessage("needEmail2fa")));
      }

      if (!attemptsCheck) {
        this.incrementSessionAttempts(user, session);
        return reject(new errors.SessionError(getMessage("needEmail2fa")));
      }

      if (session.ip.authorizedUsersId.includes(user.id)) {
        Logger.info(
          {
            name: session.name,
            ip: session.ip.address,
            session: session.id,
            fingerprint: session.fingerprint,
            user: user.id,
            email: user.email,
          },
          `Authorized session: ${session.id}`,
        );

        return resolve(session);
      }

      const fingerprintSessions = (await Prisma.session
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
            new errors.InternalServerError("Cannot get sessions in DB."),
          );
        })) as iSessionPayload[];

      if (fingerprintSessions.length > 0) {
        Logger.info(
          {
            name: session.name,
            ip: session.ip.address,
            session: session.id,
            fingerprint: session.fingerprint,
            user: user.id,
            email: user.email,
          },
          `Authorized session: ${session.id}`,
        );

        resolve(session);
      }

      fingerprintSessions.forEach(async (session) => {
        const check = await Ip.verifyAttempts(session.ip, user);

        if (check) return resolve(session);

        this.incrementSessionAttempts(user, session);
        return reject(new errors.SessionError(getMessage("needEmail2fa")));
      });

      return reject(new errors.SessionError(getMessage("needEmail2fa")));
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

      Prisma.session
        .findMany(query)
        .then((results) => {
          Logger.info(
            {
              user: userData.id,
              email: userData.email,
            },
            "Get all sessions.",
          );
          return resolve(results as iSessionPayload[]);
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot find sessions in DB."),
          );
        });
    });
  }

  getSessionById(
    sessionId: string,
    locale: string,
    userData?: iUser,
  ): Promise<iSessionPayload> {
    return new Promise((resolve, reject) => {
      let query: { id: string; userId?: string } = {
        id: sessionId,
      };

      if (userData) query.userId = userData.id;

      Prisma.session
        .findUniqueOrThrow({
          where: query,
          include: {
            ip: true,
          },
        })
        .then((result) => {
          Logger.info(
            {
              name: result.name,
              session: result.id,
            },
            "Get session by id.",
          );
          return resolve(result as iSessionPayload);
        })
        .catch(() => {
          return reject(
            new errors.UserError(getMessage("sessionNotFound", locale)),
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

      await Prisma.session
        .update({
          where: {
            id: session.id,
          },
          data,
          include: {
            ip: true,
          },
        })
        .then((session) => {
          Logger.info(
            {
              name: session.name,
              session: session.id,
              ip: session.ip.address,
            },
            "Session logout.",
          );

          return resolve(session);
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot inactive session in DB."),
          );
        });
    });
  }

  logoutAllUserSessions(
    userData: iUser,
    exception?: iSession,
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

      const userSessions = (await Prisma.session
        .findMany({
          where: query,
          include: {
            ip: true,
          },
        })
        .catch(() => {
          return reject(
            new errors.InternalServerError("Cannot inactivate sessions. 1"),
          );
        })) as iSessionPayload[];

      userSessions.forEach(async (session) => {
        Logger.info(
          {
            name: session.name,
            session: session.id,
            ip: session.ip.address,
          },
          "Session logout",
        );

        await Prisma.session
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
                "Cannot update session: " + session.id,
              ),
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

      await Prisma.session
        .update({
          where: {
            id: session.id,
          },
          data,
          include: {
            ip: true,
          },
        })
        .then((session) => {
          Logger.info(
            {
              name: session.name,
              session: session.id,
              ip: session.ip.address,
            },
            "Session blocked",
          );
          return resolve(session);
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot inactive session in DB."),
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

      const userSessions = (await Prisma.session
        .findMany({
          where: query,
          include: {
            ip: true,
          },
        })
        .catch(() => {
          return reject(
            new errors.InternalServerError("Cannot inactivate sessions. 1"),
          );
        })) as iSessionPayload[];

      userSessions.forEach(async (session) => {
        Logger.info(
          {
            name: session.name,
            session: session.id,
            ip: session.ip.address,
          },
          "Session blocked",
        );
        await Prisma.session
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
                "Cannot update session: " + session.id,
              ),
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
