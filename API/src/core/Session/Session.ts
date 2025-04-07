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
import iSessionPontuation from "../../@types/iSessionPontuation/iSessionPontuation.js";
import iLookup from "../../@types/iLookup/iLookup.js";

//external libs
import { Lookup } from "geoip-lite";

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
    userData: iUser,
    fingerprint: string,
    address: iLookup,
    authorized: boolean,
    token?: string,
    refreshToken?: string
  ): Promise<iSession> {
    return new Promise(async (resolve, reject) => {
      let data: {
        ip: string;
        location: object;
        fingerprint: string;
        authorized: boolean;
        user: {
          connect: {
            id: string;
          };
        };
        token?: string;
        refreshToken?: string;
      } = {
        ip: address.ip,
        location: address.location as object,
        fingerprint,
        authorized,
        user: {
          connect: {
            id: userData.id,
          },
        },
      };

      if (token) data.token = token;
      if (refreshToken) data.refreshToken = refreshToken;

      prisma.session
        .create({
          data,
        })
        .then((session) => {
          resolve(session);
        })
        .catch((err) => {
          reject(
            new errors.InternalServerError("Não foi possível iniciar a sessão.")
          );
        });
    });
  }
  identifySession(
    fingerprint: string,
    address: iLookup,
    userData: iUser,
    tolerancy = 2,
    token: string = "",
    refreshToken: string = ""
  ): Promise<iSession> {
    return new Promise(async (resolve, reject) => {
      const sessions: iSession[] = await prisma.session
        .findMany({
          where: {
            userId: userData.id,
          },
        })
        .catch((err) => {
          reject(
            new errors.InternalServerError("DB Error: Cannot find sessions.")
          );
          return [];
        });

      //se for o primeiro login cria uma sessão e adiciona a lista a ser verificada
      if (sessions.length === 0) {
        const newSession = await this.createSession(
          userData,
          fingerprint,
          address,
          true
        ).catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot create session in DB.")
          );
        });
        if (newSession) return resolve(newSession);
      }

      let identifiedSessions: iSessionPontuation[] = [];
      let blockedSessions: iSession[] = [];

      //verifica todas as sessões ligadas a esse dispositivo.
      sessions.forEach(async (session) => {
        let indicators: string[] = [];

        let sessionAddress = {
          ip: session.ip,
          location: session.location as unknown as Lookup,
        };
        if (sessionAddress.ip !== address.ip) {
          indicators.push("Different IP adddres.");
          if (sessionAddress.location.city !== address.location.city)
            indicators.push("Different IP adddres city.");

          if (sessionAddress.location.region !== address.location.region)
            indicators.push("Different IP adddres region.");

          if (sessionAddress.location.country !== address.location.country)
            indicators.push("Different IP adddres country.");
        }

        if (session.fingerprint !== fingerprint)
          indicators.push("Different fingerprint ID.");

        if (indicators.length <= tolerancy) {
          if (session.authorized && session.attempts <= 10) {
            identifiedSessions.push({
              ...session,
              indicators: indicators.length,
            });
          } else {
            this.notifyObserver(IncrementSessionAttempts, { session });
            blockedSessions.push(session);
          }
        }
      });

      if (blockedSessions.length === 0 && identifiedSessions.length > 0) {
        const winnerSession = identifiedSessions.reduce((min, obj) =>
          obj.indicators < min.indicators ? obj : min
        );

        if (winnerSession.indicators > 0) {
          this.createSession(
            userData,
            fingerprint,
            address,
            true,
            token,
            refreshToken
          )
            .then((sessionCreated) => {
              return resolve(sessionCreated);
            })
            .catch((err) => {
              return reject(
                new errors.InternalServerError("Cannot create session in DB.")
              );
            });
        } else {
          if (!winnerSession.active && token && refreshToken)
            return resolve(
              (await this.createSession(
                userData,
                fingerprint,
                address,
                true,
                token,
                refreshToken
              ).catch((err) => {
                return reject(
                  new errors.InternalServerError("Cannot update session in DB.")
                );
              })) as iSession
            );

          await prisma.session
            .update({
              where: {
                id: winnerSession.id,
              },
              data: {
                ip: address.ip,
                location: address.location as object,
                fingerprint,
                active: true,
              },
            })
            .catch((err) => {
              return reject(
                new errors.InternalServerError("Cannot update session in DB.")
              );
            });
          return resolve(winnerSession);
        }
      } else return reject(new errors.SessionError(response.unauthorizated()));
    });
  }
  getAllUserSessions(userData: iUser): Promise<iSession[]> {
    return new Promise((resolve, reject) => {
      prisma.session
        .findMany({
          where: { userId: userData.id, active: true },
        })
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
      let query: { id: string; active: boolean; userId?: string } = {
        id: sessionId,
        active: true,
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
  inactivateAllUserSessions(
    userData: iUser,
    exception?: iSession
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let query = {};

      if (exception)
        query = {
          userId: userData.id,
          NOT: [{ id: exception.id }],
        };

      query = {
        userId: userData.id,
      };

      prisma.session
        .updateMany({
          where: query,
          data: {
            active: false,
          },
        })
        .then((result) => {
          return resolve();
        })
        .catch((err) => {
          reject(new errors.InternalServerError("Cannot inactivate sessions."));
        });
    });
  }
  inactivateSession(
    session: iSession,
    block = false
  ): Promise<iSession | null> {
    return new Promise((resolve, reject) => {
      let data: {
        active?: boolean;
        authorized?: boolean;
      } = {
        active: false,
      };

      if (block)
        data = {
          authorized: false,
        };

      prisma.session
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
            new errors.InternalServerError("Cannot inactive session in DB>")
          );
        });
    });
  }
}

export default new Session();
