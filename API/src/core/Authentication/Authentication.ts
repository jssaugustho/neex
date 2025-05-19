//db
import prisma from "../../controllers/db.controller.js";

//errors & response
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

//external libs
import jwt from "jsonwebtoken";

//types
import { Ip as iIp, Session as iSession, User as iUser } from "@prisma/client";
import User from "../User/User.js";
import iObserver from "../../@types/iObserver/iObserver.js";
import iSubject from "../../@types/iSubject/iSubject.js";
import iTokenPayload from "../../@types/iTokenPayload/iTokenPayload.js";
import iLookup from "../../@types/iLookup/iLookup.js";

//Observers
import NotifyNewLoginUser from "../../observers/NotificateUser/EmailNewFingerprintDetected.jsx";
import Session from "../Session/Session.js";
import Token from "../Token/Token.js";
import iSessionAttempts from "../../@types/iSessionPayload/iSessionPayload.js";
import { getMessage } from "../../locales/getMessage.js";
import ResetSessionAttempts from "../../observers/SessionAttempts/ResetSessionAttempts.js";
import iSessionPayload from "../../@types/iSessionPayload/iSessionPayload.js";

class Authentication implements iSubject {
  observers: iObserver[] = [];

  constructor() {
    this.registerObserver(NotifyNewLoginUser);
    this.registerObserver(ResetSessionAttempts);
  }

  //observer functions
  registerObserver(observer: iObserver) {
    this.observers.push(observer);
  }

  removeObserver(observer: iObserver) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data: { user: iUser; session: iSession }) {
    this.observers.forEach((observer) => observer.update(data));
  }

  notifyObserver(observer: iObserver, data?: any) {
    observer.update(data);
  }

  //core
  verifyToken(token: string, session: iSessionPayload): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const decoded = (await Token.loadPayload(token).catch((err) => {
        return reject(err);
      })) as iTokenPayload;

      if (!decoded)
        return reject(
          new errors.TokenError(getMessage("invalidToken", session.locale))
        );

      if (decoded?.type !== "Token")
        return reject(
          new errors.TokenError(getMessage("invalidToken", session.locale))
        );

      const tokenUser = (await User.getUserById(decoded.id as string).catch(
        (err) => {
          return reject(
            new errors.TokenError(getMessage("invalidToken", session.locale))
          );
        }
      )) as iUser;

      const tokenSession = (await Session.getSessionById(
        decoded.sessionId as string,
        session.locale
      ).catch((err) => {
        return reject(
          new errors.TokenError(getMessage("invalidToken", session.locale))
        );
      })) as iSessionPayload;

      const authorized = await Session.verifySessionAuthorization(
        tokenUser,
        session
      ).catch((err) => {
        return reject(
          new errors.InternalServerError(
            "Cannot verify the session authorization."
          )
        );
      });

      if (!authorized)
        return reject(
          new errors.SessionError(getMessage("needEmail2fa", session.locale))
        );

      if (session.id !== tokenSession.id) {
        await prisma.session.delete({
          where: {
            id: tokenSession.id,
          },
        });
      }

      return resolve(tokenUser as iUser);
    });
  }

  verifyRefreshToken(token: string, session: iSessionPayload): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const decoded = (await Token.loadPayload(token, "refreshToken").catch(
        (err) => {
          return reject(err);
        }
      )) as iTokenPayload;

      if (!decoded)
        return reject(
          new errors.AuthError(
            getMessage("invalidRefreshToken", session.locale)
          )
        );

      if (decoded.type !== "RefreshToken")
        return reject(
          new errors.AuthError(
            getMessage("invalidRefreshToken", session.locale)
          )
        );

      const refreshTokenUser = (await User.getUserById(
        decoded.id as string
      ).catch((err) => {
        return reject(
          new errors.AuthError(
            getMessage("invalidRefreshToken", session.locale)
          )
        );
      })) as iUser;

      const refreshTokenSession = (await Session.getSessionById(
        decoded.sessionId as string,
        session.locale
      ).catch((err) => {
        return reject(
          new errors.AuthError(
            getMessage("invalidRefreshToken", session.locale)
          )
        );
      })) as iSession;

      if (
        !Session.isActive(refreshTokenSession) ||
        !refreshTokenSession ||
        !refreshTokenUser
      )
        return reject(
          new errors.TokenError(getMessage("invalidSession", session.locale))
        );

      if (token !== refreshTokenSession.refreshToken)
        return reject(
          new errors.AuthError(
            getMessage("invalidRefreshToken", session.locale)
          )
        );

      const authorized = await Session.verifySessionAuthorization(
        refreshTokenUser,
        session
      ).catch((err) => {
        return reject(
          new errors.InternalServerError(
            "Cannot verify the session authorization."
          )
        );
      });

      if (!authorized)
        return reject(
          new errors.SessionError(getMessage("needEmail2fa", session.locale))
        );

      if (session.id !== refreshTokenSession.id) {
        await prisma.session.delete({
          where: {
            id: refreshTokenSession.id,
          },
        });
      }

      return resolve(refreshTokenUser);
    });
  }

  authenticate(
    user: iUser,
    session: iSessionPayload,
    fingerprint: string,
    silent = false
  ): Promise<{ token: string; refreshToken: string }> {
    return new Promise(async (resolve, reject) => {
      const token = jwt.sign(
        {
          id: user.id,
          sessionId: session.id,
          type: "Token",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 1000 * 60 * 10, //10 minutos
        }
      );

      const refreshToken = jwt.sign(
        {
          id: user.id,
          sessionId: session.id,
          type: "RefreshToken",
        },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: 1000 * 60 * 60 * 24 * 2, //2 dias
        }
      );

      if (!user.active) {
        await prisma.user
          .update({
            where: {
              id: user.id,
            },
            data: {
              active: true,
            },
          })
          .catch((err) => {
            return reject(
              new errors.InternalServerError("Cannot reactivateuser account.")
            );
          });
      }

      const data = (await prisma.session
        .update({
          where: {
            id: session.id,
          },
          data: {
            ip: {
              connect: {
                id: session.ip.id,
              },
            },
            fingerprint,
            token,
            refreshToken,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
          include: {
            ip: true,
          },
        })
        .catch((err) => {
          return reject(new errors.InternalServerError("Erro ao gerar token."));
        })) as iSessionPayload;

      await prisma.ip
        .update({
          where: {
            id: session.ip.id,
          },
          data: {
            authorizedUsers: {
              connect: {
                id: user.id,
              },
            },
          },
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Erro ao autorizar sessão.")
          );
        });

      if (!silent) this.notify({ session: data, user });

      return resolve({ token, refreshToken });
    });
  }
}

export default new Authentication();
