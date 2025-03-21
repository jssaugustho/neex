//db
import prisma from "../../controllers/db.controller.js";

//errors & response
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

//external libs
import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";

//types
import { Session, User } from "@prisma/client";
import { VerifyErrors } from "jsonwebtoken";
import TokenPayload from "../../@types/TokenPayload/TokenPayload.js";
import Subject from "../../@types/Subject/Subject.js";
import Observer from "../../@types/Observer/Observer.js";

//core
import Cryptography from "../Cryptography/Cryptography.js";

class Authentication implements Subject {
  observers: Observer[] = [];

  constructor() {
    return this;
  }

  //observer functions
  registerObserver(observer: Observer) {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data?: any) {
    this.observers.forEach((observer) => observer.update(data));
  }

  notifyObserver(observer: Observer, data?: any) {
    observer.update(data);
  }

  //private functions
  private verifyFingerprint(
    session: Session,
    fingerprint: string,
    ip: string
  ): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      let indicators = 0;

      if (fingerprint !== session.fingerprint) indicators += 2;

      if (ip !== session.ip) indicators += 1;

      if (indicators > 1) reject(false);

      resolve(true);
    });
  }

  //core functions
  verifyLogin(
    user: string,
    passwd: string,
    fingerprint: string,
    ip: string
  ): Promise<TokenPayload> {
    return new Promise(async (resolve, reject) => {
      //find user in db by email
      let q = (await prisma.user.findUnique({
        where: {
          email: user,
        },
      })) as User;

      //verify if email exists
      if (!q) {
        reject(new errors.UserError(response.emailNotExists()));
      }

      //encrypt received passwd
      let encryptedInPasswd = Cryptography.encrypt(passwd);

      //verify if is correctly passwd
      if (q.passwd != encryptedInPasswd) {
        reject(new errors.UserError(response.incorrectPasswd()));
      }

      prisma.session
        .findFirst({
          where: {
            userId: q.id,
            needVerify: false,
          },
          orderBy: {
            updatedAt: "desc",
          },
        })
        .then((session) => {
          if (!session) {
            prisma.session
              .create({
                data: {
                  fingerprint,
                  ip,
                  needVerify: false,
                  user: {
                    connect: {
                      id: q.id,
                    },
                  },
                },
              })
              .then((session) => {
                resolve({
                  id: q.id,
                  sessionId: session.id,
                });
              })
              .catch((err) => {
                reject(
                  new errors.InternalServerError("Erro ao iniciar a sessão.")
                );
              });
          } else {
            if (session.needVerify)
              reject(new errors.SessionError(response.needVerifyEmail()));

            let needVerify = false;

            this.verifyFingerprint(session, fingerprint, ip)
              .catch(() => {
                needVerify = true;
              })
              .finally(() => {
                prisma.session
                  .create({
                    data: {
                      fingerprint,
                      ip,
                      needVerify,
                      user: {
                        connect: {
                          id: q.id,
                        },
                      },
                    },
                  })
                  .then((newSession) => {
                    if (needVerify)
                      reject(
                        new errors.SessionError(response.needVerifyEmail())
                      );

                    resolve({
                      id: q.id,
                      sessionId: newSession.id,
                    });
                  })
                  .catch((err) => {
                    reject(
                      new errors.InternalServerError(
                        "Erro ao iniciar a sessão."
                      )
                    );
                  });
              });
          }
        });
    });
  }

  verifyToken(
    token: string,
    fingerprint: string,
    ip: string
  ): Promise<TokenPayload> {
    return new Promise(async (resolve, reject) => {
      jwt.verify(
        token,
        process.env.JWT_SECRET,
        (
          err: VerifyErrors | null,
          decoded: TokenPayload | string | undefined
        ) => {
          if (err) reject(new errors.TokenError(response.invalidToken()));

          if (typeof decoded === "object" && decoded.id && decoded.sessionId) {
            prisma.session
              .findUnique({
                where: {
                  id: decoded.sessionId,
                },
              })
              .then(async (session) => {
                if (session && session.token === token) {
                  this.verifyFingerprint(session, fingerprint, ip)
                    .then((r) => {
                      resolve(decoded as TokenPayload);
                    })
                    .catch((err) => {
                      reject(new errors.TokenError(response.invalidSession()));
                    });
                }
              })
              .catch((e) => reject(new errors.InternalServerError(e.message)));
          }
        }
      );
    });
  }

  verifyRefreshToken(
    refreshToken: string,
    fingerprint: string,
    ip: string
  ): Promise<TokenPayload> {
    return new Promise(async (resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        async (
          err: VerifyErrors | null,
          decoded: TokenPayload | string | undefined
        ) => {
          if (err) reject(err);

          if (typeof decoded == "object" && decoded.id && decoded.sessionId) {
            prisma.session
              .findUnique({ where: { id: decoded.sessionId } })
              .then((session) => {
                if (session && session.refreshToken === refreshToken)
                  this.verifyFingerprint(session, fingerprint, ip)
                    .then((r) => {
                      if (r) resolve(decoded as TokenPayload);
                    })
                    .catch((err) => {
                      reject(
                        new errors.AuthError(
                          reject(
                            new errors.TokenError(response.invalidSession())
                          )
                        )
                      );
                    });
              })
              .catch((err) => reject(err));
          } else reject(new errors.AuthError(response.invalidRefreshToken()));
        }
      );
    });
  }

  authenticate(
    user: User,
    sessionId: string,
    ip: string,
    fingerprint: string
  ): Promise<{ token: string; refreshToken: string }> {
    return new Promise(async (resolve, reject) => {
      const token = jwt.sign(
        {
          id: user.id,
          sessionId,
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
        },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: 1000 * 60 * 60 * 24, //1 dia
        }
      );

      prisma.session
        .update({
          where: {
            id: sessionId,
          },
          data: {
            ip: ip,
            fingerprint: fingerprint,
            token,
            refreshToken,
          },
        })
        .then((data) => {
          resolve({ token, refreshToken });
        })
        .catch((err) => {
          reject(new errors.InternalServerError("Erro ao gerar token."));
        });
    });
  }
}

export default new Authentication();
