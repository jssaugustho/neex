//errors & response
import errors from "../../errors/errors.js";
import { getMessage } from "../../locales/getMessage.js";

//external libs
import jwt from "jsonwebtoken";
import React from "react";

//types
import { Ip as iIp, Session as iSession, User as iUser } from "@prisma/client";
import iTokenPayload from "../../@types/iTokenPayload/iTokenPayload.js";
import iSessionPayload from "../../@types/iSessionPayload/iSessionPayload.js";

//emailModels
import NewLoginDetected from "../Email/models/newLoginDetected.js";
import { PrismaClient } from "@prisma/client/extension";

//core
import Session from "../Session/Session.js";
import Token from "../Token/Token.js";
import Email from "../Email/Email.js";
import User from "../User/User.js";
import Prisma from "../Prisma/Prisma.js";
import Logger from "../Logger/Logger.js";
import Ip from "../Ip/Ip.js";

class Authentication {
  async sendLoginNotification(
    user: iUser,
    session: iSessionPayload,
    silent?: boolean
  ) {
    if (silent) return;

    return Email.sendTransacionalEmail(
      user.email,
      `Novo Login Detectado em ${session.ip.city}, ${session.ip.region} às ${new Date(
        session.lastActivity
      ).toLocaleTimeString(session.locale || "pt-br", {
        timeZone: session.timeZone || "America/Sao_Paulo",
      })} | Lux CRM ©`,
      <NewLoginDetected user={user} session={session} />
    );
  }

  verifyLogin(email: string, passwd: string, session): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      //baixa o usuario do banco de dados
      const user = await User.getUserByEmail(email).catch((err) => {
        throw err;
      });

      if (!(await Ip.verifyAttempts(session.ip, user)))
        return reject( new errors.SessionError(
          getMessage("attemptLimit", session.locale)
        ));

      if (user.passwd !== passwd) {
        await Session.incrementSessionAttempts(user, session);
        return reject(new errors.AuthError(getMessage("wrongPassword", session.locale)));
      }

      return resolve(user);
    });
  }

  //core
  verifyToken(
    token: string,
    session: iSessionPayload,
    locale = "pt-BR"
  ): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const decoded = (await Token.loadPayload(token, "token", locale).catch(
        (err) => {
          return reject(err);
        }
      )) as iTokenPayload;

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

      const authorized = await Session.sessionSecurityVerification(
        tokenUser,
        session
      ).catch((err) => {
        return reject(
          new errors.InternalServerError(
            "Cannot verify the session authorization."
          )
        );
      });

      if (
        !tokenSession?.userId ||
        !tokenSession?.token ||
        !tokenSession?.refreshToken
      )
        return reject(new errors.AuthError(getMessage("unauthorized")));

      if (!authorized)
        return reject(
          new errors.SessionError(getMessage("needEmail2fa", session.locale))
        );

      if (session.id !== tokenSession.id) {
        await Prisma.session.delete({
          where: {
            id: tokenSession.id,
          },
        });
      }

      Logger.info(
        {
          name: session.name,
          ip: session.ip.address,
          session: session.id,
          fingerprint: session.fingerprint,
          user: tokenUser.id,
          email: tokenUser.email,
        },
        "Token verified successfully."
      );

      return resolve(tokenUser as iUser);
    });
  }

  verifyRefreshToken(
    token: string,
    session: iSessionPayload,
    locale = "pt-BR"
  ): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const decoded = (await Token.loadPayload(
        token,
        "refreshToken",
        locale
      ).catch((err) => {
        return reject(err);
      })) as iTokenPayload;

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

      const authorized = await Session.sessionSecurityVerification(
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
        await Prisma.session.delete({
          where: {
            id: refreshTokenSession.id,
          },
        });
      }

      Logger.info(
        {
          name: session.name,
          ip: session.ip.address,
          session: session.id,
          user: refreshTokenUser.id,
          email: refreshTokenUser.email,
        },
        "Refresh token verified successfully."
      );

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
        await Prisma.user
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

      await Prisma.session
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
            unauthorizedUsers: {
              disconnect: {
                id: user.id,
              },
            },
            lastActivity: new Date(),
          },
          include: {
            ip: true,
          },
        })
        .catch((err) => {
          return reject(new errors.InternalServerError("Erro ao gerar token."));
        });

      await Prisma.ip
        .update({
          where: {
            id: session.ip.id,
          },
          data: {
            lastActivity: new Date(),
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

      await this.sendLoginNotification(user, session);
      await Session.resetSessionAttempts(user, session);

      Logger.info(
        {
          name: session.name,
          ip: session.ip.address,
          session: session.id,
          user: user.id,
          email: user.email,
        },
        "Succesful authentication."
      );

      return resolve({ token, refreshToken });
    });
  }
}

export default new Authentication();
