//core
import Session from "../core/Session/Session.js";
import User from "../core/User/User.js";

//response & errors
import errors from "../errors/errors.js";

//types
import { Response, NextFunction } from "express";
import iRequest from "../@types/iRequest/iRequest.js";
import IpType from "../types/IpType/IpType.js";
import { Session as iSession, User as iUser } from "@prisma/client";

//validators
import FingerprintType from "../types/FingerprintType/FingerprintType.js";
import ObjectIdType from "../types/ObjectIdType/ObjectIdType.js";

//db
import prisma from "../controllers/db.controller.js";
import UserAgentType from "../types/UserAgentType/UserAgentType.js";
import LocaleType from "../types/LocaleType/LocaleType.js";
import TimeZoneType from "../types/TimeZoneType/TimeZoneType.js";
import { getMessage } from "../locales/getMessage.js";
import Ip from "../core/Ip/Ip.js";
import iSessionPayload from "../@types/iSessionPayload/iSessionPayload.js";

async function userAgentBlackList(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.session) throw new errors.InternalServerError("Session error.");

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
      throw new errors.AuthError(
        getMessage("unauthorized", req.session?.locale)
      );
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

  req.data.fingerprint = new FingerprintType(
    req.headers["fingerprint"] as string,
    req.data.acceptLanguage
  ).getValue();

  let ipLookup = new IpType(
    req.ip as string,
    req.data.acceptLanguage
  ).getLookup();

  req.ipLookup = await Ip.upsertIp(ipLookup);

  let sessionId = "";

  if (req.headers.session) {
    sessionId = new ObjectIdType(
      req.headers.session as string,
      req.data.acceptLanguage
    ).getValue();

    req.session = await Session.sessionIdentifier(
      req.data.fingerprint,
      req.ipLookup,
      req.data.userAgent,
      req.data.timeZone,
      req.data.acceptLanguage,
      sessionId
    ).catch((err) => {
      throw err;
    });
  } else {
    req.session = await Session.sessionIdentifier(
      req.data.fingerprint,
      req.ipLookup,
      req.data.userAgent,
      req.data.timeZone,
      req.data.acceptLanguage
    ).catch((err) => {
      throw err;
    });
  }

  next();
}

async function validateSessionId(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userData) throw new errors.InternalServerError("Userdata error");
  if (!req.session) throw new errors.InternalServerError("Session error");

  let sessionId = new ObjectIdType(
    req.params.sessionId,
    req.data.acceptLanguage
  ).getValue();

  const session = await Session.getSessionById(
    sessionId,
    req.data.acceptLanguage
  ).catch((err) => {
    throw new errors.UserError(
      getMessage("sessionNotFound", req.session?.locale)
    );
  });

  if (!session)
    throw new errors.UserError(
      getMessage("sessionNotFound", req.session.locale)
    );

  if (!Session.isActive(session))
    throw new errors.UserError(
      getMessage("inactiveSession", req.session.locale)
    );

  if (
    req.session?.userId === req.userData.id ||
    req?.userPrivilege === "SUPPORT" ||
    req?.userPrivilege === "ADMIN"
  ) {
    req.session = session;
    next();
  } else {
    throw new errors.AuthError(
      getMessage("requirePrivilege", req.data.acceptLanguage, {
        privilege: getMessage("ownerSupportOrAdmin", req.data.acceptLanguage),
      })
    );
  }
}

async function validateIpId(req: iRequest, res: Response, next: NextFunction) {
  if (!req.userData) throw new errors.InternalServerError("Userdata error");
  if (!req.session) throw new errors.InternalServerError("Session error");

  let ipId = new ObjectIdType(
    req.params.ipId,
    req.data.acceptLanguage
  ).getValue();

  const ip = await Ip.getIpById(ipId, req.data.acceptLanguage).catch((err) => {
    throw new errors.UserError(getMessage("ipNotFound", req.session?.locale));
  });

  if (!ip)
    throw new errors.UserError(getMessage("ipNotFound", req.session.locale));

  if (
    req.session?.ipId === ip.id ||
    req?.userPrivilege === "SUPPORT" ||
    req?.userPrivilege === "ADMIN"
  ) {
    req.ipLookup = ip;
    next();
  } else {
    throw new errors.AuthError(
      getMessage("requirePrivilege", req.data.acceptLanguage, {
        privilege: getMessage("ownerSupportOrAdmin", req.session.locale),
      })
    );
  }
}

async function validateUserId(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userData) throw new errors.InternalServerError("UserData error.");
  if (!req.session) throw new errors.InternalServerError("Session error.");

  if (
    req.userData?.role !== "ADMIN" &&
    req.userData?.role !== "SUPPORT" &&
    req.userData.id !== req.params.userId
  )
    throw new errors.UserError(
      getMessage("requirePrivilege", req.data.acceptLanguage, {
        privilege: getMessage("ownerSupportOrAdmin", req.data.acceptLanguage),
      })
    );

  req.data.userId = new ObjectIdType(
    req.params?.userId as string,
    req.data.acceptLanguage
  ).getValue();

  req.userData = (await User.getUserById(req.data.userId).catch((err) => {
    throw new errors.UserError(getMessage("userNotFound", req.session?.locale));
  })) as iUser;

  next();
}

async function getSessions(req: iRequest, res: Response, next: NextFunction) {
  if (!req.userData) throw new errors.InternalServerError("UserData error.");
  if (!req.session) throw new errors.InternalServerError("Session error.");

  const sessions = (await prisma.session
    .findMany({
      where: {
        ip: {
          authorizedUsersId: {
            has: req.userData.id,
          },
        },
      },
      take: req.data.take,
      skip: req.data.skip,
      include: {
        ip: true,
      },
    })
    .catch((err) => {
      throw new errors.InternalServerError("Cannot get sessions in DB.");
    })) as iSessionPayload[];

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

  const messageKey =
    publicSessions.length <= 0
      ? "noSessionsFound"
      : publicSessions.length === 1
        ? "sessionFound"
        : "sessionsFound";

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: getMessage(messageKey, req.session.locale, {
        count: publicSessions.length,
      }),
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
  if (!req.session) throw new errors.InternalServerError("Session error.");

  const authorizedIps = await prisma.ip.findMany({
    where: {
      authorizedUsersId: {
        has: req.userData.id,
      },
    },
  });

  const sessions = await prisma.session
    .count({
      where: {
        OR: authorizedIps.map((ip) => {
          return {
            ipId: ip.id,
          };
        }),
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
      message: getMessage("sessionsFound", req.session.locale, {
        count: sessions,
      }),
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
  userAgentBlackList,
  getSession,
  validateSessionId,
  validateUserId,
  validateIpId,
  getSessions,
  countSessions,
  getAtualSession,
};
