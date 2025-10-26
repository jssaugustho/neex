//types
import { NextFunction, Response } from "express";
import iRequest from "../@types/iRequest/iRequest.js";

//errors
import errors from "../errors/errors.js";
import response from "../response/response.js";
import { getMessage } from "../lib/getMessage.js";

async function validateSteps(req: iRequest, res: Response, next: NextFunction) {
  req.data.take = parseInt(req.query.take as string) || 100;
  req.data.skip = parseInt(req.query.skip as string) || 0;

  next();
}

async function verifyAdminAndSupport(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session error");

  if (req.userData?.role !== "ADMIN" && req.userData?.role !== "SUPPORT") {
    throw new errors.AuthError(
      getMessage("requirePrivileges", req.session.locale, {
        privilege: getMessage("ownerSupportOrAdmin", req.session.locale),
      }),
    );
  }

  req.userPrivilege = req.userData.role;

  next();
}

async function verifyAdmin(req: iRequest, res: Response, next: NextFunction) {
  if (req.userData?.role !== "ADMIN")
    throw new errors.AuthError(response.unauthorizated());

  next();
}

export default {
  validateSteps,
  verifyAdminAndSupport,
  verifyAdmin,
};
