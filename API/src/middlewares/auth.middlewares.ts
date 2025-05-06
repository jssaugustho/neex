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
import { Session as iSession, User as iUser } from "@prisma/client";

//validators
import EmailType from "../types/EmailType/EmailType.js";
import PasswdType from "../types/PasswdType/PasswdType.js";
import FingerprintType from "../types/FingerprintType/FingerprintType.js";
import TokenType from "../types/TokenType/TokenType.js";
import ObjectIdType from "../types/ObjectIdType/ObjectIdType.js";

//observers
import IncrementSessionAttempts from "../observers/SessionAttempts/IncrementSessionAttempts.js";

//db
import prisma from "../controllers/db.controller.js";
import UserAgentType from "../types/UserAgentType/UserAgentType.js";
import LocaleType from "../types/LocaleType/LocaleType.js";
import TimeZoneType from "../types/TimeZoneType/TimeZoneType.js";
import { getMessage } from "../locales/getMessage.js";

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

async function getSession(req: iRequest, res: Response, next: NextFunction) {
  req.data = {};

  req.data.acceptLanguage = new LocaleType(
    req.headers["accept-language"] as string,
    "pt-BR"
  ).getValue() as string;

  req.data.userAgent = new UserAgentType(
    req.headers["user-agent"] as string,
    req.data.acceptLanguage
  ).getValue();

  req.data.timeZone = new TimeZoneType(
    req.headers["x-timezone"] as string,
    req.data.acceptLanguage
  ).getValue();

  console.log(req.data.timeZone);

  req.data.fingerprint = new FingerprintType(
    req.headers["fingerprint"] as string,
    req.data.acceptLanguage
  ).getValue();

  req.data.ipLookup = new IpType(
    req.ip as string,
    req.data.acceptLanguage
  ).getLookup();

  let sessionId = "";

  if (req.headers.session) {
    sessionId = new ObjectIdType(
      req.headers.session as string,
      req.data.acceptLanguage
    ).getValue();

    req.session = await Session.identifySession(
      req.data.fingerprint,
      req.data.ipLookup,
      req.data.userAgent,
      req.data.timeZone,
      req.data.acceptLanguage,
      sessionId
    ).catch((err) => {
      throw err;
    });
  } else {
    req.session = await Session.identifySession(
      req.data.fingerprint,
      req.data.ipLookup,
      req.data.userAgent,
      req.data.timeZone,
      req.data.acceptLanguage
    ).catch((err) => {
      throw err;
    });
  }

  next();
}

//verify login and send user id to next in req.id
async function verifyLogin(req: iRequest, res: Response, next: NextFunction) {
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

  if (!Session.verifyAttempts(req.session as iSession, req.userData))
    throw new errors.SessionError(
      getMessage("attemptLimit", req.data.acceptLanguage)
    );

  if (req.session)
    if (req.userData.passwd !== passwd) {
      Session.notifyObserver(IncrementSessionAttempts, {
        session: req.session,
        user: req.userData,
      });
      throw new errors.AuthError(
        getMessage("wrongPassword", req.data.acceptLanguage)
      );
    }

  //verifica se essa sessão necessita de 2fa autorizá-la.
  const authorized = (await Session.verifySessionAuthorization(
    req.userData,
    req.session as iSession
  ).catch(() => {
    return false;
  })) as boolean;

  if (!authorized) {
    throw new errors.SessionError(
      getMessage("needEmail2fa", req.data.acceptLanguage)
    );
  }

  next();
}

//verify active token and send id to next in req.userData
async function verifyToken(req: iRequest, res: Response, next: NextFunction) {
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

  const user = await Authentication.verifyToken(
    token,
    req.session as iSession,
    req.data.acceptLanguage
  ).catch((err) => {
    throw err;
  });

  req.userData = user;

  next();
}

//verify token and send id to next in req.id
async function verifyRefreshToken(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  //captura o refresh token da requisição

  //verifify if token exists
  if (!req.body.refreshToken) {
    throw new errors.UserError(
      getMessage("obrigatoryParams", req.data.acceptLanguage)
    );
  }

  //get token
  let refreshToken = new TokenType(
    req.body.refreshToken,
    req.data.acceptLanguage
  ).getValue();

  const user = await Authentication.verifyRefreshToken(
    refreshToken,
    req.session as iSession,
    req.data.acceptLanguage
  ).catch((err) => {
    throw err;
  });

  req.userData = user;

  next();
}

//get user data from the token payload
async function validateSessionId(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userData) throw new errors.InternalServerError("Userdata error");

  let sessionId = new ObjectIdType(
    req.params.sessionId,
    req.data.acceptLanguage
  ).getValue();

  const session = await Session.getSessionById(
    sessionId,
    req.data.acceptLanguage
  ).catch((err) => {
    throw new errors.UserError(response.sessionNotFound());
  });

  if (!session) throw new errors.UserError(response.sessionNotFound());

  if (!Session.isActive(session))
    throw new errors.UserError(response.sessionInactive());

  let userPrivilege =
    req.userData.role === "ADMIN" || req.userData.role === "SUPPORT";

  if (req.session?.userId === req.userData.id || userPrivilege) {
    req.session = session;
    next();
  } else {
    throw new errors.AuthError(response.unauthorizated());
  }
}

//get user data from the token payload
async function validateUserId(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userData) throw new errors.InternalServerError("UserData error.");

  if (
    req.userData?.role !== "ADMIN" &&
    req.userData?.role !== "SUPPORT" &&
    req.userData.id !== req.params.userId
  )
    throw new errors.UserError(response.unauthorizated());

  req.data.userId = new ObjectIdType(
    req.params?.userId as string,
    req.data.acceptLanguage
  ).getValue();

  req.userData = (await User.getUserById(req.data.userId).catch((err) => {
    throw new errors.UserError(response.userNotFound());
  })) as iUser;

  next();
}

async function getSessions(req: iRequest, res: Response, next: NextFunction) {
  if (!req.userData) throw new errors.InternalServerError("UserData error.");

  const sessions = (await prisma.session
    .findMany({
      where: {
        authorizedUsersId: {
          has: req.userData.id,
        },
      },
      take: req.data.take,
      skip: req.data.skip,
    })
    .catch((err) => {
      throw new errors.InternalServerError("Cannot get sessions in DB.");
    })) as (iSession & { authorizedUsers: iUser[] })[];

  const publicSessions = sessions.map((session) => {
    session.token =
      "***********************************************************************************";
    session.refreshToken =
      "***********************************************************************************";

    session.fingerprint = "************************";

    return session;
  });

  let activeSessions = publicSessions.filter((session) => {
    if (session.userId === req.userData?.id) return session;
  });

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: response.sessionsFound(publicSessions.length),
      info: {
        count: publicSessions.length,
        showing: req.data.take,
        skipped: req.data.skip,
        activeSessions: activeSessions.length,
      },
      data: publicSessions,
    },
  };

  next();
}

async function countSessions(req: iRequest, res: Response, next: NextFunction) {
  if (!req.userData) throw new errors.InternalServerError("UserData error.");

  const sessions = await prisma.session
    .count({
      where: {
        authorizedUsersId: {
          has: req.userData.id,
        },
      },
    })
    .catch((err) => {
      throw new errors.InternalServerError("Cannot count sessions in DB.");
    });

  const activeSessions = await prisma.session
    .count({
      where: {
        userId: req.userData.id,
      },
    })
    .catch((err) => {
      throw new errors.InternalServerError("Cannot count sessions in DB.");
    });

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: response.sessionsFound(sessions),
      info: {
        count: sessions,
        activeSessions,
      },
    },
  };

  next();
}

async function getAtualSession(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userData) throw new errors.InternalServerError("UserData error.");
  if (!req.session) throw new errors.InternalServerError("Session error.");

  let session = req.session;

  session.token =
    "***********************************************************************************";
  session.refreshToken =
    "***********************************************************************************";

  session.fingerprint = "************************";

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: "Sessão encontrada.",
      data: session,
    },
  };

  next();
}

export default {
  getSession,
  userAgentBlackList,
  verifyLogin,
  verifyRefreshToken,
  verifyToken,
  validateSessionId,
  validateUserId,
  getSessions,
  countSessions,
  getAtualSession,
};
