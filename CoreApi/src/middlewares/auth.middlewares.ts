//core
import Authentication from "../core/Authentication/Authentication.js";
import Session from "../core/Session/Session.js";
import User from "../core/User/User.js";
import Ip from "../core/Ip/Ip.js";

//response & errors
import errors from "../errors/errors.js";
import { getMessage } from "../locales/getMessage.js";

//types
import { Response, NextFunction } from "express";
import iRequest from "../@types/iRequest/iRequest.js";

//validators
import EmailType from "../types/EmailType/EmailType.js";
import PasswdType from "../types/PasswdType/PasswdType.js";
import TokenType from "../types/TokenType/TokenType.js";

async function verifyLogin(req: iRequest, res: Response, next: NextFunction) {
  if (!req.session) throw new errors.InternalServerError("Session error.");
  if (!req.ipLookup) throw new errors.InternalServerError("IpLookup error.");

  const passwd = new PasswdType(
    req.body.passwd,
    req.data.acceptLanguage
  ).getValue();
  const email = new EmailType(
    req.body.email,
    req.data.acceptLanguage
  ).getValue();

  //baixa o usuario do banco de dados
  req.userData = await User.getUserByEmail(email).catch((err) => {
    throw err;
  });

  if (!(await Ip.verifyAttempts(req.ipLookup, req.userData)))
    throw new errors.SessionError(
      getMessage("attemptLimit", req.session.locale)
    );

  if (req.userData.passwd !== passwd) {
    await Session.incrementSessionAttempts(req.userData, req.session);
    throw new errors.AuthError(getMessage("wrongPassword", req.session.locale));
  }

  //verifica se essa sessão necessita de 2fa autorizá-la.
  const authorized = (await Session.sessionSecurityVerification(
    req.userData,
    req.session
  ).catch(() => {
    return false;
  })) as boolean;

  if (!authorized) {
    throw new errors.SessionError(
      getMessage("needEmail2fa", req.session.locale)
    );
  }

  next();
}

async function verifyToken(req: iRequest, res: Response, next: NextFunction) {
  if (!req.session) throw new errors.InternalServerError("Session error.");

  //verify if header exists
  if (!req.headers["authorization"])
    throw new errors.AuthError(
      getMessage("obrigatoryHeaders", req.data.acceptLanguage)
    );

  //get token
  let token = new TokenType(
    req.headers["authorization"].split(" ")[1],
    req.data.acceptLanguage
  ).getValue();

  const user = await Authentication.verifyToken(token, req.session).catch(
    (err) => {
      throw err;
    }
  );

  req.userData = user;

  next();
}

async function verifyRefreshToken(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.session) throw new errors.InternalServerError("Session error.");

  //verifify if token exists
  if (!req.body.refreshToken) {
    throw new errors.UserError(
      getMessage("obrigatoryParams", req.session.locale)
    );
  }

  //get token
  let refreshToken = new TokenType(
    req.body.refreshToken,
    req.session.locale
  ).getValue();

  const user = await Authentication.verifyRefreshToken(
    refreshToken,
    req.session
  ).catch((err) => {
    throw err;
  });

  req.userData = user;
  req.data.silent = true;

  next();
}

export default {
  verifyLogin,
  verifyRefreshToken,
  verifyToken,
};
