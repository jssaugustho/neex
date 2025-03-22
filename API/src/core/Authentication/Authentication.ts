//db
import prisma from "../../controllers/db.controller.js";

//errors & response
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

//external libs
import jwt, { JwtPayload } from "jsonwebtoken";
import geoip from "geoip-lite";

//types
import { Session, User } from "@prisma/client";
import { VerifyErrors } from "jsonwebtoken";
import TokenPayload from "../../@types/TokenPayload/TokenPayload.js";
import Subject from "../../@types/Subject/Subject.js";
import Observer from "../../@types/Observer/Observer.js";

//core
import Cryptography from "../Cryptography/Cryptography.js";
import auth from "../../routes/auth.route.js";

//Observers
import EmailToUser from "./Observers/EmailToUser.js";

class Authentication implements Subject {
  observers: Observer[] = [];

  constructor() {
    this.registerObserver(EmailToUser);
  }

  //observer functions
  registerObserver(observer: Observer) {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data: { userData: User; session: Session }) {
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
  ): Session | false {
    let indicators = 0;

    if (!session.authorized) return false;

    if (session.attempts >= 5) indicators += 1;

    if (fingerprint !== session.fingerprint) indicators += 1;

    if (this.verifyIpCity(ip) !== this.verifyIpCity(session.ip))
      indicators += 1;

    if (indicators >= 2) return false;

    return session;
  }

  private getIpv4(ip: string) {
    const match = ip.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
    return match ? match[0] : null;
  }

  private createSession(
    userData: User,
    fingerprint: string,
    ip: string,
    authorized: boolean
  ): Promise<Session> {
    return new Promise(async (resolve, reject) => {
      prisma.session
        .create({
          data: {
            ip,
            fingerprint,
            user: {
              connect: {
                id: userData.id,
              },
            },
            authorized,
          },
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
        .findMany({
          where: {
            userId: q.id,
          },
          orderBy: {
            updatedAt: "desc",
          },
        })
        .then((sessions) => {
          let payload: TokenPayload = {};

          if (sessions.length === 0) {
            this.createSession(q, fingerprint, ip, true)
              .then((session) => {
                this.notify({ session, userData: q });
                return resolve({ id: q.id, sessionId: session.id });
              })
              .catch(() => {
                return reject(
                  new errors.InternalServerError("Erro ao iniciar sessão.")
                );
              });
          } else {
            let create = true;

            sessions.forEach((session) => {
              if (this.verifyFingerprint(session, fingerprint, ip)) {
                create = false;
                this.notify({ session, userData: q });
                return resolve({ id: q.id, sessionId: session.id });
              } else if (
                session.fingerprint === fingerprint &&
                session.ip === ip
              ) {
                prisma.session
                  .update({
                    where: {
                      id: session.id,
                      authorized: false,
                    },
                    data: {
                      ip,
                      fingerprint,
                      attempts: session.attempts + 1,
                    },
                  })
                  .then(() => {
                    return reject(
                      new errors.SessionError(response.needVerifyEmail())
                    );
                  })
                  .catch(() => {
                    return reject(
                      new errors.InternalServerError(
                        "Não foi possível atualizar a sessão."
                      )
                    );
                  });
                create = false;
              }
            });

            if (create)
              this.createSession(q, fingerprint, ip, false)
                .then(() => {
                  return reject(
                    new errors.SessionError(response.needVerifyEmail())
                  );
                })
                .catch(() => {
                  return reject(
                    new errors.InternalServerError("Erro ao iniciar sessão.")
                  );
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
                  if (this.verifyFingerprint(session, fingerprint, ip)) {
                    resolve(decoded);
                  } else {
                    reject(new errors.SessionError(response.needVerifyEmail()));
                  }
                } else {
                  reject(new errors.TokenError(response.invalidToken()));
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
                  if (this.verifyFingerprint(session, fingerprint, ip)) {
                    resolve(decoded as TokenPayload);
                  } else {
                    reject(new errors.SessionError(response.needVerifyEmail()));
                  }
                else {
                  reject(new errors.AuthError(response.invalidRefreshToken()));
                }
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

  deauthenticate(sessionId: string): Promise<Session> {
    return new Promise(async (resolve, reject) => {
      prisma.session
        .delete({
          where: {
            id: sessionId,
          },
        })
        .then((data) => {
          if (!data)
            return reject(new errors.UserError(response.sessionNotFound()));
          return resolve(data);
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Não foi possível deletar.")
          );
        });
    });
  }

  deauthenticateAll(userId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      prisma.session
        .deleteMany({
          where: {
            userId,
          },
        })
        .then((r) => {
          return resolve();
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Não foi possível deletar.")
          );
        });
    });
  }

  verifyIpCity(ip: string) {
    let ipMatch = this.getIpv4(ip);

    if (process.env.NODE_ENV === "development" && ipMatch === "127.0.0.1")
      return "localhost";

    let location = geoip.lookup(ipMatch);

    return location.city;
  }
}

export default new Authentication();
