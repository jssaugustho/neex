//types
import { NextFunction, Response } from "express";
import RequestUserPayload from "../@types/iRequest/iRequest.js";

//core
import Authentication from "../core/Authentication/Authentication.js";

//errors
import response from "../response/response.js";
import errors from "../errors/errors.js";
import IpType from "../types/IpType/IpType.js";
import Session from "../core/Session/Session.js";

//auth user, register and send token
async function authenticate(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  if (!req.session) throw new errors.InternalServerError("Session not found");

  if (!req.userData) throw new errors.InternalServerError("UserData not found");

  if (!req.data.fingerprint)
    throw new errors.UserError(response.needFingerprintHeader());

  let address = new IpType(req.ip as string).getLookup();

  Authentication.authenticate(
    req.userData,
    req.session,
    req.data.fingerprint,
    address,
    req.data.userAgent
  )
    .then((data) => {
      const publicData = req.userData;
      if (publicData) publicData.passwd = "********************************";

      req.response = {
        statusCode: 200,
        output: {
          status: "Ok",
          message: response.succesAuth(),
          token: "Bearer " + data.token,
          refreshToken: data.refreshToken,
          sessionId: req.session?.id as string,
          data: publicData,
        },
      };

      if (!req.userData?.active)
        req.response.output.info = {
          reactivate: true,
        };

      res.status(req.response.statusCode).send(req.response.output);
    })
    .catch(next);
}

async function inactivateAllUserSessions(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  if (!req.session) throw new errors.InternalServerError("Session not found");

  if (!req.userData) throw new errors.InternalServerError("UserData not found");

  Session.inactivateAllUserSessions(req.userData, req.session).then((count) => {
    res.status(200).send({
      status: "Ok",
      message: response.sessionsInactived(count),
      info: {
        count,
      },
    });
  });
}

async function blockAllUserSessions(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  if (!req.session) throw new errors.InternalServerError("Session not found");

  if (!req.userData) throw new errors.InternalServerError("UserData not found");

  Session.blockAllUserSessions(req.userData, req.session).then((count) => {
    res.status(200).send({
      status: "Ok",
      message: response.sessionsUnauthorized(count),
      info: {
        count,
      },
    });
  });
}

async function inactivateSession(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  if (!req.session) throw new errors.UserError(response.sessionNotFound());
  if (!req.userData) throw new errors.UserError(response.userNotFound());

  Session.inactivateSession(req.session, req.userData)
    .then((session) => {
      res.status(200).send({
        status: "Ok",
        message: response.sessionsInactived(1),
      });
    })
    .catch((err) => {
      throw err;
    });
}

async function blockSession(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  if (!req.session) throw new errors.UserError(response.sessionNotFound());
  if (!req.userData) throw new errors.UserError(response.userNotFound());

  Session.blockSession(req.session, req.userData)
    .then((session) => {
      res.status(200).send({
        status: "Ok",
        message: response.sessionsUnauthorized(1),
      });
    })
    .catch((err) => {
      throw err;
    });
}

//auth user, register and send token
async function responseRequests(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  if (!req.response)
    throw new errors.InternalServerError("Response not found.");

  res.status(req.response.statusCode).send(req.response.output);
}

export default {
  authenticate,
  inactivateAllUserSessions,
  inactivateSession,
  blockSession,
  responseRequests,
  blockAllUserSessions,
};
