//db
import prisma from "../../controllers/db.controller.js";

//errors & response
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

//external libs
import jwt from "jsonwebtoken";

//types
import { Session as iSession, User as iUser } from "@prisma/client";
import { VerifyErrors } from "jsonwebtoken";
import User from "../User/User.js";
import iObserver from "../../@types/iObserver/iObserver.js";
import iSubject from "../../@types/iSubject/iSubject.js";
import iTokenPayload from "../../@types/iTokenPayload/iTokenPayload.js";
import iLookup from "../../@types/iLookup/iLookup.js";

//Observers
import NotifyNewLoginUser from "../../observers/NotificateUser/EmailNewFingerprintDetected.js";
import Session from "../Session/Session.js";
import Token from "../Token/Token.js";
import iSessionAttempts from "../../@types/iSessionAttempt/iSessionAttempt.js";

class Authentication implements iSubject {
  observers: iObserver[] = [];

  constructor() {
    this.registerObserver(NotifyNewLoginUser);
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
  verifyToken(token: string, session: iSession): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const decoded = (await Token.loadPayload(token).catch((err) => {
        return reject(err);
      })) as iTokenPayload;

      if (!decoded)
        return reject(new errors.TokenError(response.invalidToken()));

      if (decoded?.type !== "Token")
        return reject(new errors.TokenError(response.invalidToken()));

      if (session.id !== decoded?.sessionId)
        return reject(new errors.TokenError(response.invalidToken()));

      const tokenUser = (await User.getUserById(decoded.id as string).catch(
        (err) => {
          return reject(new errors.TokenError(response.invalidToken()));
        }
      )) as iUser;

      const tokenSession = (await Session.getSessionById(
        decoded.sessionId as string
      ).catch((err) => {
        return reject(new errors.TokenError(response.invalidToken()));
      })) as iSession;

      if (!Session.isActive(tokenSession) || !tokenSession || !tokenUser)
        return reject(new errors.TokenError(response.invalidSession()));

      if (token !== tokenSession.token)
        return reject(new errors.TokenError(response.invalidToken()));

      const authorized = await Session.verifySessionAuthorization(
        tokenUser,
        session,
        false
      ).catch((err) => {
        return reject(
          new errors.InternalServerError(
            "Cannot verify the session authorization."
          )
        );
      });

      if (!authorized)
        return reject(new errors.SessionError(response.needVerifyEmail()));

      return resolve(tokenUser as iUser);
    });
  }

  verifyRefreshToken(token: string, session: iSession): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const decoded = (await Token.loadPayload(token, "refreshToken").catch(
        (err) => {
          return reject(err);
        }
      )) as iTokenPayload;

      if (!decoded)
        return reject(new errors.AuthError(response.invalidRefreshToken()));

      if (decoded.type !== "RefreshToken")
        return reject(new errors.AuthError(response.invalidRefreshToken()));

      if (session.id !== decoded.sessionId)
        return reject(new errors.TokenError(response.invalidSession()));

      const refreshTokenUser = (await User.getUserById(
        decoded.id as string
      ).catch((err) => {
        return reject(new errors.AuthError(response.invalidRefreshToken()));
      })) as iUser;

      const refreshTokenSession = (await Session.getSessionById(
        decoded.sessionId as string
      ).catch((err) => {
        return reject(new errors.AuthError(response.invalidRefreshToken()));
      })) as iSession;

      if (
        !Session.isActive(refreshTokenSession) ||
        !refreshTokenSession ||
        !refreshTokenUser
      )
        return reject(new errors.TokenError(response.invalidSession()));

      if (token !== refreshTokenSession.refreshToken)
        return reject(new errors.AuthError(response.invalidRefreshToken()));

      const authorized = await Session.verifySessionAuthorization(
        refreshTokenUser,
        session,
        false
      ).catch((err) => {
        return reject(
          new errors.InternalServerError(
            "Cannot verify the session authorization."
          )
        );
      });

      if (!authorized)
        return reject(new errors.SessionError(response.needVerifyEmail()));

      return resolve(refreshTokenUser);
    });
  }

  authenticate(
    user: iUser,
    session: iSession,
    fingerprint: string,
    location: iLookup,
    firstTime: boolean = false
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

      let sessionAttempts: iSessionAttempts = {};

      sessionAttempts[user.id] = {
        attempts: 0,
        timeStamp: Date.now(),
      };

      if (session.attempts) {
        sessionAttempts = {
          ...(session.attempts as iSessionAttempts),
          ...sessionAttempts,
        };
      }

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

      prisma.session
        .update({
          where: {
            id: session.id,
          },
          data: {
            ip: location.ip,
            location: location.location as object,
            fingerprint,
            token,
            refreshToken,
            attempts: sessionAttempts,
            user: {
              connect: {
                id: user.id,
              },
            },
            authorizedUsers: {
              connect: {
                id: user.id,
              },
            },
          },
        })
        .then((data) => {
          if (!firstTime) this.notify({ session: data, user });
          return resolve({ token, refreshToken });
        })
        .catch((err) => {
          return reject(new errors.InternalServerError("Erro ao gerar token."));
        });
    });
  }
}

export default new Authentication();
