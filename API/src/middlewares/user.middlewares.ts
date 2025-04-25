//db
import prisma from "../controllers/db.controller.js";

//types
import { NextFunction, Response } from "express";
import iRequest from "../@types/iRequest/iRequest.js";
import { Session as iSession, User as iUser } from "@prisma/client";

//core
import EmailType from "../types/EmailType/EmailType.js";
import PasswdType from "../types/PasswdType/PasswdType.js";
import SmallTextType from "../types/SmallTextType/SmallText.js";
import PhoneType from "../types/PhoneType/PhoneType.js";
import User from "../core/User/User.js";

//errors
import errors from "../errors/errors.js";
import response from "../response/response.js";

//validate
import RoleType from "../types/RoleType/RoleType.js";
import ObjectIdType from "../types/ObjectIdType/ObjectIdType.js";
import Session from "../core/Session/Session.js";
import SendVerificationCode from "../observers/VerificationCode/SendVerificationCode.js";

//verify login and send user id to next in req.id
async function validateRegisterParams(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  let email = new EmailType(req.body.email);

  await email.avaible().catch((err) => {
    throw err;
  });

  let phone = new PhoneType(req.body.phone);

  await phone.avaible().catch((err) => {
    throw err;
  });

  req.data.email = email.getValue();
  req.data.passwd = new PasswdType(req.body.passwd).getValue();
  req.data.name = new SmallTextType(req.body.name).getValue();
  req.data.lastName = new SmallTextType(req.body.lastName).getValue();
  req.data.phone = phone.getValue();

  next();
}

async function registerNewUser(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  req.userData = (await User.createNewUser(
    req.session as iSession,
    req.data.email,
    req.data.name,
    req.data.lastName,
    req.data.phone,
    req.data.passwd
  ).catch(next)) as iUser;

  req.response = {
    statusCode: 201,
    output: {
      status: "Ok",
      message: "Usuário criado com sucesso.",
    },
  };

  next();
}

async function emailExists(req: iRequest, res: Response, next: NextFunction) {
  let email = new EmailType(req.body.email);

  await email.avaible().catch((err) => {
    throw err;
  });

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: response.emailAvaible(),
    },
  };

  next();
}

async function validateUserId(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  let id = new ObjectIdType(
    req.params.id,
    new errors.UserError(response.userNotFound())
  ).getValue();

  req.userData = (await User.getUserById(id).catch(next)) as iUser;

  next();
}

async function getUser(req: iRequest, res: Response, next: NextFunction) {
  let publicData = req.userData;

  if (publicData?.passwd)
    publicData.passwd = "*************************************";

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: response.sessionsFound(1),
      data: req.userData,
    },
  };

  next();
}

async function getUsers(req: iRequest, res: Response, next: NextFunction) {
  const query: any = {
    take: req.data.take,
    skip: req.data.skip,
  };

  let where = {};

  if (req.data.search) {
    query.where = {
      OR: [
        { name: { contains: req.data.search, mode: "insensitive" } },
        { lastName: { contains: req.data.search, mode: "insensitive" } },
        { email: { contains: req.data.search, mode: "insensitive" } },
        { phone: { contains: req.data.search, mode: "insensitive" } },
      ],
    };

    where = query.where;
  }

  const users = await prisma.user.findMany(query).catch((err) => {
    throw new errors.InternalServerError("Cannot get users in DB.");
  });

  const publicUsers = users.map((user) => {
    user.passwd = "*************************************";

    return user;
  });

  const lenght = await prisma.user
    .count({
      where,
    })
    .catch(() => {
      throw new errors.InternalServerError("Cannot count users in DB.");
    });

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: response.userFound(lenght),
      info: {
        lenght,
        showing: req.data.take,
        skipped: req.data.skip,
      },
      data: publicUsers,
    },
  };

  next();
}

async function countAllUsers(req: iRequest, res: Response, next: NextFunction) {
  let where = {};

  if (req.data.search) {
    where = {
      OR: [
        { name: { contains: req.data.search, mode: "insensitive" } },
        { lastName: { contains: req.data.search, mode: "insensitive" } },
        { email: { contains: req.data.search, mode: "insensitive" } },
        { phone: { contains: req.data.search, mode: "insensitive" } },
      ],
    };
  }

  const count = await prisma.user
    .count({
      where,
    })
    .catch((err) => {
      throw new errors.InternalServerError("Cannot count users in DB.");
    });

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: "Usuários encontrados.",
      data: {
        count: count,
      },
    },
  };

  next();
}

async function validateUpdateParams(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  req.data = {};
  req.data.body = {};

  if (req.body.name)
    req.data.body.name = new SmallTextType(req.body.name).getValue();

  if (req.body.lastName)
    req.data.body.lastName = new SmallTextType(req.body.lastName).getValue();

  if (req.body.email) {
    let email = new EmailType(req.body.email);

    await email.avaible().catch((err) => {
      throw err;
    });

    req.data.body.email = email.getValue();
    req.data.body.emailVerified = false;
  }

  if (req.body.phone) {
    let phone = new PhoneType(req.body.phone);

    await phone.avaible().catch((err) => {
      throw err;
    });

    req.data.body.phone = phone.getValue();
  }

  if (req.body.passwd)
    req.data.body.passwd = new PasswdType(req.body.passwd).getValue();

  if (req.body.role) {
    if (req.userData?.role !== "ADMIN")
      throw new errors.UserError(response.unauthorizated());

    req.data.body.role = new RoleType(req.body.role).getValue();
  }

  if (req.body.active) {
    if (typeof req.body.active !== "boolean")
      throw new errors.UserError(response.invalidParam("active"));

    req.data.body.active = req.body.active;
  }

  if (Object.keys(req.data.body).length === 0) {
    throw new errors.UserError(response.needOneBodyParam());
  }

  next();
}

async function validateUpdateQuery(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  req.data.query = {};

  if (!req.userData) throw new errors.InternalServerError("Userdata error");

  const privilege =
    req.userData.role === "ADMIN" || req.userData.role === "SUPPORT";

  if (!req.params.query || typeof req.params.query !== "string")
    throw new errors.UserError(response.invalidQuery());

  if (!privilege) throw new errors.AuthError(response.unauthorizated());

  req.data.query = {
    OR: [{ email: req.params.query }, { id: req.params.query }],
  };

  if (Object.keys(req.data.query).length === 0) {
    throw new errors.UserError(response.invalidQuery());
  }

  next();
}

async function ownUserQuery(req: iRequest, res: Response, next: NextFunction) {
  if (!req.userData) throw new errors.InternalServerError("Userdata error");

  req.data.query = {
    id: req.userData.id,
  };

  next();
}

async function validateSearch(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  if (req.query.search && typeof req.query.search === "string")
    req.data.search = req.query.search;

  next();
}

async function updateUsers(req: iRequest, res: Response, next: NextFunction) {
  const user = await prisma.user
    .updateMany({
      where: req.data.query,
      data: req.data.body,
    })
    .catch((err) => {
      console.log(err);
      throw new errors.InternalServerError("Cannot edit users in DB.");
    });

  if (req.data.body.email) {
    Session.notifyObserver(SendVerificationCode, {
      session: req.session,
      user,
    });
  }

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: "Usuário atualizado.",
    },
  };

  next();
}

export default {
  validateRegisterParams,
  registerNewUser,
  emailExists,
  getUser,
  getUsers,
  countAllUsers,
  updateUsers,
  validateUpdateParams,
  validateUpdateQuery,
  validateUserId,
  validateSearch,
  ownUserQuery,
};
