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

//types
import iObserver from "../../@types/iObserver/iObserver.js";
import iSubject from "../../@types/iSubject/iSubject.js";
import iLookup from "../../@types/iLookup/iLookup.js";
import iSessionPayload from "../../@types/iSessionPayload/iSessionPayload.js";

//external libs
import { UAParser } from "ua-parser-js";
import { create } from "domain";
import iIpPayload from "../../@types/iIpPayload/iIpPayload.js";

class Ip implements iSubject {
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

  getIpById(ipId: string, acceptLanguage: string): Promise<iIpPayload> {
    return new Promise(async (resolve, reject) => {
      const ip = (await prisma.ip
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
      let ip = (await prisma.ip.findUnique({
        where: {
          address: lookup.ip,
        },
        include: {
          attempt: true,
          authorizedUsers: true,
        },
      })) as iIpPayload;

      if (!ip)
        ip = (await prisma.ip.create({
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
      else
        ip = (await prisma.ip.update({
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

      resolve(ip);
    });
  }

  verifyAttempts(ip: iIp, user: iUser): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const attempts = await prisma.attempt.findMany({
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
    exception?: iSessionPayload
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

      const sessions = (await prisma.session
        .findMany({
          where: query,
        })
        .catch((err) => {
          reject(new errors.InternalServerError("Cannot inactivate sessions."));
        })) as iSession[];

      let changedIps: iIpPayload[] = [];

      sessions.forEach(async (session) => {
        await prisma.session
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
                "Cannot update session: " + session.id
              )
            );
          });

        if (session.ipId !== exception?.ipId) {
          const ip = (await prisma.ip
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
                  "Cannot update session: " + session.id
                )
              );
            })) as iIpPayload;

          changedIps.push(ip);
        }
      });

      return resolve(sessions.length);
    });
  }

  unauthorizeIp(ip: iIpPayload, user: iUser): Promise<iIp | null> {
    return new Promise(async (resolve, reject) => {
      const ipSessions = (await prisma.session
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
            new errors.InternalServerError("Cannot inactive session in DB.")
          );
        })) as iSessionPayload[];

      ipSessions.forEach(async (session) => {
        await prisma.session.update({
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

      await prisma.ip
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
            new errors.InternalServerError("Cannot update ip: " + ip.id)
          );
        });

      return resolve(ip);
    });
  }
}

export default new Ip();
