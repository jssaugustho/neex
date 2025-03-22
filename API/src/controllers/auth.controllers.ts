//types
import { NextFunction, Response } from "express";
import RequestUserPayload from "../@types/RequestUserPayload/RequestUserPayload.js";

//core
import Authentication from "../core/Authentication/Authentication.js";

//errors
import response from "../response/response.js";
import errors from "../errors/errors.js";

//auth user, register and send token
async function auth(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  if (!req.tokenPayload?.sessionId)
    throw new errors.InternalServerError("TokenPayload error");

  if (!req.userData) throw new errors.InternalServerError("UserData error");

  if (!req.headers["fingerprint"])
    throw new errors.UserError(response.needFingerprintHeader());

  if (!req.ip) throw new errors.UserError(response.obrigatoryParam("ip"));

  Authentication.authenticate(
    req.userData,
    req.tokenPayload.sessionId,
    req.ip,
    req.headers["fingerprint"] as string
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

async function deAuth(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {}

async function deAuthAll(
  req: RequestUserPayload,
  res: Response,
  next: NextFunction
) {
  if (!req.userData?.id) throw new errors.AuthError(response.needAuth());

  Authentication.deauthenticateAll(req.userData.id).then((session) => {
    res.status(200).send({
      status: "Ok",
      message: "Sessão invalidada com sucesso.",
    });
  });
}

export default {
  auth,
  deAuth,
  deAuthAll,
};
