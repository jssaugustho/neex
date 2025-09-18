//types
import iRequest from "../@types/iRequest/iRequest.js";
import { NextFunction, Response } from "express";
import errors from "../errors/errors.js";
import { getMessage } from "../locales/getMessage.js";
import Core from "../core/core.js";

const { Verification } = Core;

async function response(req: iRequest, res: Response, next: NextFunction) {
  if (!req.response?.statusCode && !req.response?.output)
    throw new errors.InternalServerError("Sem resposta.");

  res.status(req.response?.statusCode).send(req.response?.output);
}

//change password token
async function verifyRecovery(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session not found");
  if (!req.userData) throw new errors.InternalServerError("UserData not found");

  Verification.generate2faLink(req.userData, req.session, "SET_NEW_PASSWD")
    .then((data) => {
      req.response = {
        statusCode: 200,
        output: {
          status: "Ok",
          message: getMessage("tokenVerified"),
          session: req.session?.id as string,
          data: {
            email: req.userData?.email,
          },
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

export default {
  verifyRecovery,
  response,
};
