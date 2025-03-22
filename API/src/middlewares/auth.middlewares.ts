//core
import Authentication from "../core/Authentication/Authentication.js";

//response & errors
import errors from "../errors/errors.js";
import response from "../response/response.js";

//types
import { Response, NextFunction } from "express";
import RequestUserPayload from "../@types/RequestUserPayload/RequestUserPayload.js";
import User from "../core/User/User.js";
import Cryptography from "../core/Cryptography/Cryptography.js";

//verify if user-agent is in blcklist
async function userAgentBlackList(
  req: RequestUserPayload,
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
async function verifyLogin(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  let { email, passwd } = req.body;

  //validate params
  let lostParams: string[] = [];

  if (!email) {
    lostParams.push("email");
  }

  if (!passwd) {
    lostParams.push("senha");
  }

  if (lostParams.length > 0) {
    throw new errors.UserError(response.obrigatoryParam(lostParams));
  }

  if (!req.headers["fingerprint"])
    throw new errors.UserError(response.needFingerprintHeader());

  if (!req.ip) throw new errors.UserError(response.obrigatoryParam("ip"));

  Authentication.verifyLogin(
    email,
    passwd,
    req.headers["fingerprint"] as string,
    req.ip
  )
    .then((payload) => {
      req.tokenPayload = payload;
      next();
    })
    .catch(next);
}

//verify active token and send id to next in req.userData
async function verifyToken(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  //verify if header exists
  if (!req.headers["authorization"])
    throw new errors.AuthError(response.needAuth());

  if (!req.headers["fingerprint"])
    throw new errors.AuthError(response.needFingerprintHeader());

  //get token
  let token = req.headers["authorization"].split(" ")[1];

  if (!token) throw new errors.AuthError(response.needAuth());

  Authentication.verifyToken(
    token,
    req.headers["fingerprint"] as string,
    req.ip as string
  )
    .then((payload) => {
      req.tokenPayload = payload;
      next();
    })
    .catch(next);
}

//verify token and send id to next in req.id
async function verifyRefreshToken(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  //captura o refresh token da requisição
  let { refreshToken } = req.body;

  //verifify if token exists
  if (!refreshToken) {
    throw new errors.UserError(response.obrigatoryParam("refreshToken"));
  }

  if (!req.headers["fingerprint"])
    throw new errors.AuthError(response.needFingerprintHeader());

  Authentication.verifyRefreshToken(
    refreshToken,
    req.headers["fingerprint"] as string,
    req.ip as string
  )
    .then((payload) => {
      req.tokenPayload = payload;
      next();
    })
    .catch(next);
}

//verify if email is verified
async function isEmailVerified(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  if (req.userData && !req.userData.emailVerified)
    throw new errors.UserError(response.verifyYourEmail());
  next();
}

//get user data from the token payload
async function getUserData(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  if (!req.tokenPayload)
    throw new errors.InternalServerError("Erro ao carregar usuário.");

  User.getUserByToken(req.tokenPayload)
    .then((user) => {
      req.userData = user;
      next();
    })
    .catch(next);
}

//get user data from the token payload
async function validateDeleteSession(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  if (req.body.userId && req.body.sessionId) {
    req.deleteSession = req.body.sessionId;

    if (req.userData.role === support) next();
  }
  if (!req.body.user && req.body.sessionId) {
    req.deleteSession = req.body.sessionId;
    next();
  }
}

export default {
  userAgentBlackList,
  verifyLogin,
  verifyRefreshToken,
  verifyToken,
  isEmailVerified,
  getUserData,
  validateDeleteSession,
};
