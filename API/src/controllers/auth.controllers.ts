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

  if (!req.headers["fingerprint"])
    throw new errors.UserError(response.needFingerprintHeader());

  let ip = new IpType(req.ip as string).getLookup();

  Authentication.authenticate(
    req.userData,
    req.session.id,
    ip,
    req.headers["fingerprint"] as string,
    req.data.firstTime
  )
    .then((data) => {
      const publicData = req.userData;
      if (publicData) publicData.passwd = "********************************";

      res.status(200).send({
        status: "Ok",
        message: response.succesAuth(),
        token: "bearer " + data.token,
        refreshToken: data.refreshToken,
        data: publicData,
      });
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

  Session.inactivateAllUserSessions(req.userData, req.session).then(() => {
    res.status(200).send({
      status: "Ok",
      message: "Todas as sessões foram inativadas.",
    });
  });
}

async function inactivateSession(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  if (!req.session) throw new errors.UserError(response.sessionNotFound());

  Session.inactivateSession(req.session)
    .then((session) => {
      res.status(200).send({
        status: "Ok",
        message: "Sessão invalidada.",
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

  Session.inactivateSession(req.session, true)
    .then((session) => {
      res.status(200).send({
        status: "Ok",
        message: "Sessão invalidada.",
      });
    })
    .catch((err) => {
      throw err;
    });
}

export default {
  authenticate,
  inactivateAllUserSessions,
  inactivateSession,
  blockSession,
};
