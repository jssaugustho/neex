import { data } from "framer-motion/client";
//types
import { NextFunction, Response } from "express";
import RequestUserPayload from "../@types/iRequest/iRequest.js";

//errors
import errors from "../errors/errors.js";
import { getMessage } from "../locales/getMessage.js";

import Core from "../core/core.js";
import { serve } from "swagger-ui-express";

const { Authentication, Ip, Session, Verification, Logger } = Core;

//auth user, register and send token
async function authenticate(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session not found");

  if (!req.userData) throw new errors.InternalServerError("UserData not found");

  const expiresIn = req.data.remember
    ? Number(process.env.REMEMBER_EXPIRES_IN)
    : Number(process.env.NOT_REMEMBER_EXPIRES_IN);

  Authentication.authenticate(
    req.userData,
    req.session,
    req.data.fingerprint,
    expiresIn,
    req.data?.silent || false,
  )
    .then((data) => {
      let publicData = {
        id: req.userData?.id,
        email: req.userData?.email,
        emailVerified: req.userData?.emailVerified,
        phone: req.userData?.phone,
        name: req.userData?.name,
        lastName: req.userData?.lastName,
        timeZone: req.userData?.timeZone,
        locale: req.userData?.locale,
        role: req.userData?.role,
      };

      req.response = {
        statusCode: 200,
        output: {
          status: "Ok",
          message: getMessage("successAuthentication", req.session?.locale),
          data: publicData,
        },
      };

      if (!req.userData?.active)
        req.response.output.info = {
          reactivate: true,
        };

      res.cookie("session", req.session?.id, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: expiresIn,
        path: "/",
      });
      ("");

      res.cookie("token", `Bearer ${data.token}`, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 10,
        path: "/",
      });
      ("");

      res.cookie("refreshToken", `Bearer ${data.refreshToken}`, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: expiresIn,
        path: "/",
      });

      res.status(req.response.statusCode).send(req.response.output);
    })
    .catch(next);
}

//auth user, register and send token
async function preAuthentication(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session not found");

  if (!req.userData) throw new errors.InternalServerError("UserData not found");

  Verification.generate2faLink(req.userData, req.session, "PRE_AUTHENTICATION")
    .then((data) => {
      req.response = {
        statusCode: 200,
        output: {
          status: "Ok",
          message: getMessage("successPreAuthentication"),
          session: req.session?.id as string,
        },
      };

      if (!req.userData?.active)
        req.response.output.info = {
          reactivate: true,
        };

      res.cookie("actionToken", data.token, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 1000 * 60 * 10, // 10 min
      });

      res.status(req.response.statusCode).send(req.response.output);
    })
    .catch(next);
}

async function logoutSession(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session Error");
  if (!req.userData) throw new errors.InternalServerError("Userdata Error");

  Session.logoutSession(req.session, req.userData)
    .then((session) => {
      res.status(200).send({
        status: "Ok",
        message: getMessage("inactivatedSession", req.session?.locale),
      });
    })
    .catch((err) => {
      throw err;
    });
}

async function logoutSessions(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session not found");

  if (!req.userData) throw new errors.InternalServerError("UserData not found");

  Session.logoutAllUserSessions(req.userData, req.session).then((count) => {
    res.status(200).send({
      status: "Ok",
      message: getMessage("inactivatedSession", req.session?.locale, {
        count,
      }),
      info: {
        count,
      },
    });
  });
}

async function blockSession(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.UserError("Session Error");
  if (!req.userData) throw new errors.UserError("UserData Error");

  Session.blockSession(req.session, req.userData)
    .then((session) => {
      res.status(200).send({
        status: "Ok",
        message: getMessage("blockSession", req.session?.locale),
      });
    })
    .catch((err) => {
      throw err;
    });
}

async function blockSessions(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session not found");

  if (!req.userData) throw new errors.InternalServerError("UserData not found");

  Session.blockAllUserSessions(req.userData, req.session).then((count) => {
    let message = getMessage("noBlockedSession");

    if (count > 1)
      message = getMessage("blockedSessions", req.session?.locale, { count });

    if (count === 1)
      message = getMessage("blockedSession", req.session?.locale);

    res.status(200).send({
      status: "Ok",
      message: getMessage("blockSessions", req.session?.locale, {
        count,
      }),
      info: {
        count,
      },
    });
  });
}

async function unauthorizeIp(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session error.");
  if (!req.userData) throw new errors.InternalServerError("User data error.");
  if (!req.ipLookup) throw new errors.InternalServerError("Ip lookup error.");

  Ip.unauthorizeIp(req.ipLookup, req.userData)
    .then(() => {
      res.status(200).send({
        status: "Ok",
        message: getMessage("unauthorizedIp", req.session?.locale),
      });
    })
    .catch((err) => {
      throw err;
    });
}

async function unauthorizeIps(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session error.");
  if (!req.userData) throw new errors.InternalServerError("User data error.");
  if (!req.ipLookup) throw new errors.InternalServerError("Ip lookup error.");

  Ip.unauthorizeIps(req.userData, req.session)
    .then((count) => {
      let message = getMessage("noUnauthorizedIp");

      if (count > 1)
        message = getMessage("unauthorizedIps", req.session?.locale, { count });

      if (count === 1)
        message = getMessage("unauthorizedIp", req.session?.locale);

      res.status(200).send({
        status: "Ok",
        message,
        info: {
          count,
        },
      });
    })
    .catch(next);
}

async function responseRequests(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction,
) {
  if (!req.response)
    throw new errors.InternalServerError("Response not found.");

  res.status(req.response.statusCode).send(req.response.output);
}

export default {
  authenticate,
  preAuthentication,
  unauthorizeIp,
  unauthorizeIps,
  responseRequests,
  logoutSession,
  logoutSessions,
  blockSession,
  blockSessions,
};
