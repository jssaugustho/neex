//types
import { NextFunction, Response } from "express";
import iRequest from "../@types/iRequest/iRequest.js";
import { Session as iSession, User as iUser } from "@prisma/client";

//errors
import errors from "../errors/errors.js";
import { getMessage } from "../locales/getMessage.js";

//validate
import RoleType from "../types/RoleType/RoleType.js";
import ObjectIdType from "../types/ObjectIdType/ObjectIdType.js";

import Core from "../core/core.js";
import iResponse from "../@types/iResponse/iResponse.js";

const { User, Verification, Prisma, Logger } = Core;

async function validateAvatar(req: iRequest, res: Response, next: NextFunction) {
  Logger.info("teste");
  next();
}
async function uploadAvatar(req: iRequest, res: Response, next: NextFunction) {
  next();
}

export default {
  validateAvatar,
  uploadAvatar
};
