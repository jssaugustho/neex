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

//core
import Core from "../core/core.js";

const { Session, Authentication } = Core;

async function verifyLogin(req: iRequest, res: Response, next: NextFunction) {
  if (!req.session) throw new errors.InternalServerError("Session error.");
  if (!req.ipLookup) throw new errors.InternalServerError("IpLookup error.");

  const passwd = new PasswdType(
    req.body.passwd,
    req.data.acceptLanguage,
    false
  ).getValue();
  const email = new EmailType(
    req.body.email,
    req.data.acceptLanguage
  ).getValue();

  req.userData = await Authentication.verifyLogin(
    email,
    passwd,
    req.session
  ).catch((err) => {
    throw err;
  });

  //verifica se essa sessão necessita de 2fa autorizá-la.
  req.session = await Session.sessionSecurityVerification(
    req.userData,
    req.session
  ).catch((err) => {
    throw err;
  });

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
