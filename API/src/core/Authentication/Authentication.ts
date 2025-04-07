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
import { Lookup } from "geoip-lite";

//core
import Cryptography from "../Cryptography/Cryptography.js";

//Observers
import NotifyNewLoginUser from "../../observers/NotificateUser/EmailNewFingerprintDetected.js";
import Session from "../Session/Session.js";
import Token from "../Token/Token.js";

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
  verifyToken(
    token: string,
    fingerprint: string,
    address: iLookup
  ): Promise<{ session: iSession; user: iUser }> {
    return new Promise(async (resolve, reject) => {
      const decoded = (await Token.loadPayload(token).catch((err) => {
        return reject(err);
      })) as iTokenPayload;

      if (decoded.type !== "Token")
        return reject(new errors.TokenError(response.invalidToken()));

      if (decoded.id && decoded.sessionId) {
        const user = (await User.getUserById(decoded.id).catch((err) => {
          reject(new errors.TokenError(response.invalidToken()));
          return {};
        })) as iUser;

        const tokenSession = (await Session.getSessionById(
          decoded.sessionId
        ).catch((err) => {
          return reject(new errors.TokenError(response.invalidToken()));
        })) as iSession;

        await Session.identifySession(
          fingerprint,
          address,
          user,
          1,
          tokenSession?.token,
          tokenSession?.refreshToken
        )
          .then((result) => {
            if (result.token !== token)
              return reject(new errors.TokenError(response.invalidToken()));

            return resolve({ session: result, user });
          })
          .catch((err) => {
            return reject(err);
          });
      }
    });
  }

  verifyRefreshToken(
    refreshToken: string,
    fingerprint: string,
    address: iLookup
  ): Promise<{ session: iSession; user: iUser }> {
    return new Promise(async (resolve, reject) => {
      const decoded: iTokenPayload = await Token.loadPayload(
        refreshToken,
        "refreshToken"
      ).catch((err) => {
        reject(err);
        return {};
      });

      if (decoded.type !== "RefreshToken")
        return reject(new errors.AuthError(response.invalidRefreshToken()));

      if (decoded.id && decoded.sessionId) {
        const user = (await User.getUserById(decoded.id).catch((err) => {
          return reject(new errors.AuthError(response.invalidRefreshToken()));
        })) as iUser;

        const tokenSession = (await Session.getSessionById(
          decoded.sessionId
        ).catch((err) => {
          return reject(new errors.TokenError(response.invalidToken()));
        })) as iSession;

        await Session.identifySession(
          fingerprint,
          address,
          user,
          1,
          tokenSession?.token,
          tokenSession?.refreshToken
        )
          .then((result) => {
            if (refreshToken !== result.refreshToken)
              return reject(
                new errors.AuthError(response.invalidRefreshToken())
              );

            return resolve({ session: result, user });
          })
          .catch((err) => {
            return reject(err);
          });
      }
    });
  }

  authenticate(
    user: iUser,
    sessionId: string,
    location: iLookup,
    fingerprint: string,
    firstTime: boolean = false
  ): Promise<{ token: string; refreshToken: string }> {
    return new Promise(async (resolve, reject) => {
      const token = jwt.sign(
        {
          id: user.id,
          sessionId,
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
          sessionId,
          type: "RefreshToken",
        },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: 1000 * 60 * 60 * 24 * 2, //2 dias
        }
      );

      prisma.session
        .update({
          where: {
            id: sessionId,
          },
          data: {
            ip: location.ip,
            location: location.location as object,
            fingerprint: fingerprint,
            token,
            refreshToken,
            attempts: 0,
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
