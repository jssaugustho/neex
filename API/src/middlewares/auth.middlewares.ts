//core
import Authentication from "../core/Authentication/Authentication.js";
import Session from "../core/Session/Session.js";
import User from "../core/User/User.js";

//response & errors
import errors from "../errors/errors.js";
import response from "../response/response.js";

//types
import { Response, NextFunction } from "express";
import iRequest from "../@types/iRequest/iRequest.js";
import IpType from "../types/IpType/IpType.js";
import { Session as iSession } from "@prisma/client";

//validators
import EmailType from "../types/EmailType/EmailType.js";
import PasswdType from "../types/PasswdType/PasswdType.js";
import FingerprintType from "../types/FingerprintType/FingerprintType.js";
import TokenType from "../types/TokenType/TokenType.js";
import IncrementSessionAttempts from "../observers/SessionAttempts/IncrementSessionAttempts.js";
import ObjectIdType from "../types/ObjectIdType/ObjectIdType.js";

//verify if user-agent is in blcklist
async function userAgentBlackList(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  const blockedUserAgents = [
    "curl",
    "python-requests",
    "PostmanRuntime",
    "Scrapy",
    "Java",
    "Go-http-client",
  ];

  blockedUserAgents.forEach((ua) => {
    if (
      req.headers["user-agent"]?.includes(ua) ||
      req.headers["user-agent"] === ""
    )
      throw new errors.AuthError(response.blockedUserAgent());
  });

  next();
}

//verify login and send user id to next in req.id
async function verifyLogin(req: iRequest, res: Response, next: NextFunction) {
  const passwd = new PasswdType(req.body.passwd).getValue();
  const email = new EmailType(req.body.email).getValue();

  //baixa o usuario do banco de dados
  const user = await User.getUserByEmail(email).catch((err) => {
    throw err;
  });

  //identifica as sessões do mesmo dispositivo e retorna uma lista
  let authorized = await Session.identifySession(
    req.data.fingerprint,
    req.data.ipLookup,
    user
  ).catch((err) => {
    throw err;
  });

  if (user.passwd !== passwd) {
    Session.notifyObserver(IncrementSessionAttempts, {
      Session: authorized,
    });
    throw new errors.AuthError(response.incorrectPasswd());
  }

  //se houver uma sessão liberada e nenhuma bloqueada verifica o login
  if (authorized) {
    req.userData = user;
    req.session = authorized;
    next();
  }
}

//verify active token and send id to next in req.userData
async function verifyToken(req: iRequest, res: Response, next: NextFunction) {
  //verify if header exists
  if (!req.headers["authorization"])
    throw new errors.AuthError(response.needAuth());
  //get token
  let token = new TokenType(
    req.headers["authorization"].split(" ")[1]
  ).getValue();

  if (!token) throw new errors.AuthError(response.needAuth());

  const { user, session } = await Authentication.verifyToken(
    token,
    req.data.fingerprint,
    req.data.ipLookup
  ).catch((err) => {
    throw err;
  });

  req.userData = user;
  req.session = session;

  next();
}

//verify token and send id to next in req.id
async function verifyRefreshToken(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  //captura o refresh token da requisição
  let { refreshToken } = req.body;

  //verifify if token exists
  if (!refreshToken) {
    throw new errors.UserError(response.obrigatoryParam("refreshToken"));
  }

  const { user, session } = await Authentication.verifyRefreshToken(
    refreshToken,
    req.data.fingerprint,
    req.data.ipLookup
  ).catch((err) => {
    throw err;
  });

  req.userData = user;
  req.session = session;

  next();
}

//verify if email is verified
async function isEmailVerified(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (req.userData && !req.userData.emailVerified)
    throw new errors.UserError(response.verifyYourEmail());
  next();
}

//get user data from the token payload
async function validateInactivateSession(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userData) throw new errors.AuthError(response.needAuth());

  let sessionId = new ObjectIdType(req.body.sessionId).getValue();

  const session = await Session.getSessionById(req.body.sessionId).catch(
    (err) => {
      throw err;
    }
  );

  if (!session) throw new errors.UserError(response.sessionNotFound());

  if (
    req.userData.role === "SUPPORT" ||
    req.userData.role === "ADMIN" ||
    session.userId === req.userData.id
  ) {
    req.session = session;
    next();
  } else {
    throw new errors.AuthError(response.unauthorizated());
  }
}

async function getFingerprint(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  req.data = {};

  req.data.fingerprint = new FingerprintType(
    req.headers.fingerprint as string
  ).getValue();

  req.data.ipLookup = new IpType(req.ip as string).getLookup();

  next();
}

export default {
  userAgentBlackList,
  verifyLogin,
  verifyRefreshToken,
  verifyToken,
  isEmailVerified,
  validateInactivateSession,
  getFingerprint,
};
