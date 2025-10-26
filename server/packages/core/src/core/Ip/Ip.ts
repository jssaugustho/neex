import {
  User as iUser,
  Session as iSession,
  Attempt as iAttempt,
  Ip as iIp,
} from "@prisma/client";

//errors
import errors from "../../errors/errors.js";
import { getMessage } from "../../lib/getMessage.js";

//types
import iLookup from "../../@types/iLookup/iLookup.js";
import iSessionPayload from "../../@types/iSessionPayload/iSessionPayload.js";

import iIpPayload from "../../@types/iIpPayload/iIpPayload.js";
import Prisma from "../Prisma/Prisma.js";
import Logger from "../Logger/Logger.js";

class Ip {
  getIpById(ipId: string, acceptLanguage: string): Promise<iIpPayload> {
    return new Promise(async (resolve, reject) => {
      const ip = (await Prisma.ip
        .findUnique({
          where: {
            id: ipId,
          },
        })
        .catch(() => {
          throw new errors.UserError(getMessage("ipNotFound", acceptLanguage));
        })) as iIpPayload;

      return resolve(ip);
    });
  }

  upsertIp(lookup: iLookup): Promise<iIpPayload> {
    return new Promise(async (resolve, reject) => {
      let ip = (await Prisma.ip.findUnique({
        where: {
          address: lookup.ip,
        },
        include: {
          attempt: true,
          authorizedUsers: true,
        },
      })) as iIpPayload;

      if (!ip) {
        ip = (await Prisma.ip.create({
          data: {
            address: lookup.ip,
            city: lookup.city,
            region: lookup.region,
            country: lookup.country,
            timeZone: lookup.timezone,
            ll: lookup.ll,
          },
          include: {
            attempt: true,
            authorizedUsers: true,
          },
        })) as iIpPayload;
        Logger.info(
          {
            ip: ip.address,
            city: ip.city,
            region: ip.region,
            country: ip.country,
          },
          `Identified new address: ${ip.address}`,
        );
      } else {
        ip = (await Prisma.ip.update({
          where: {
            address: lookup.ip,
          },
          data: {
            updatedAt: new Date(),
            address: lookup.ip,
            city: lookup.city,
            region: lookup.region,
            country: lookup.country,
            timeZone: lookup.timezone,
            ll: lookup.ll,
          },
          include: {
            attempt: true,
            authorizedUsers: true,
          },
        })) as iIpPayload;

        Logger.info(
          {
            ip: ip.address,
            city: ip.city,
            region: ip.region,
            country: ip.country,
          },
          `Identified existent address: ${ip.address}`,
        );
      }

      resolve(ip);
    });
  }

  verifyAttempts(ip: iIp, user: iUser): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const attempts = await Prisma.attempt.findMany({
        where: {
          ipId: ip.id,
          userId: user.id,
          active: true,
        },
      });

      const validAttempts: iAttempt[] = [];

      attempts.forEach((attempt) => {
        const now = new Date();
        const createdAt = new Date(attempt.createdAt);
        const maxInterval = 1000 * 60 * 60;

        const interval = now.getTime() - createdAt.getTime();

        if (interval < maxInterval) {
          validAttempts.push(attempt);
        }
      });

      if (validAttempts.length >= 10) return resolve(false);

      return resolve(true);
    });
  }

  unauthorizeIps(
    userData: iUser,
    exception?: iSessionPayload,
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      let query: any = {
        ip: {
          authorizedUsersId: {
            has: userData.id,
          },
        },
      };

      if (exception)
        query = {
          ip: {
            authorizedUsersId: {
              has: userData.id,
            },
          },
          NOT: [
            {
              ip: {
                id: exception.ipId,
              },
            },
          ],
        };

      const sessions = (await Prisma.session
        .findMany({
          where: query,
        })
        .catch((err) => {
          reject(new errors.InternalServerError("Cannot inactivate sessions."));
        })) as iSession[];

      let changedIps: iIpPayload[] = [];

      sessions.forEach(async (session) => {
        const upSession = await Prisma.session
          .update({
            where: {
              id: session.id,
            },
            data: {
              user: {
                disconnect: true,
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

        if (session.ipId !== exception?.ipId) {
          const ip = (await Prisma.ip
            .update({
              where: {
                id: session.ipId,
              },
              data: {
                authorizedUsers: {
                  disconnect: { id: userData.id },
                },
              },
            })
            .catch(() => {
              return reject(
                new errors.InternalServerError(
                  "Cannot update session: " + session.id,
                ),
              );
            })) as iIpPayload;

          changedIps.push(ip);
        }
      });

      Logger.info(
        {
          user: userData.id,
          email: userData.email,
        },
        "Unauthorized all user IPs.",
      );
      return resolve(sessions.length);
    });
  }

  unauthorizeIp(ip: iIpPayload, user: iUser): Promise<iIp | null> {
    return new Promise(async (resolve, reject) => {
      const ipSessions = (await Prisma.session
        .findMany({
          where: {
            ip: {
              id: ip.id,
            },
          },
          include: {
            ip: true,
          },
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot inactive session in DB."),
          );
        })) as iSessionPayload[];

      ipSessions.forEach(async (session) => {
        await Prisma.session.update({
          where: {
            id: session.id,
          },
          data: {
            token: "",
            refreshToken: "",
            user: {
              disconnect: true,
            },
          },
        });
      });

      await Prisma.ip
        .update({
          where: {
            id: ip.id,
          },
          data: {
            authorizedUsers: {
              disconnect: { id: user.id },
            },
          },
        })
        .catch(() => {
          return reject(
            new errors.InternalServerError("Cannot update ip: " + ip.id),
          );
        });

      Logger.info(
        {
          ip: ip.address,
          user: user.id,
          email: user.email,
        },
        "Unauthorized IP.",
      );

      return resolve(ip);
    });
  }
}

export default new Ip();
