//types
import { NextFunction, Response } from "express";
import iRequest from "../@types/iRequest/iRequest.js";
import { Session as iSession, User as iUser } from "@prisma/client";

//core
import EmailType from "../types/EmailType/EmailType.js";
import PasswdType from "../types/PasswdType/PasswdType.js";
import SmallTextType from "../types/SmallTextType/SmallText.js";
import PhoneType from "../types/PhoneType/PhoneType.js";

//errors
import errors from "../errors/errors.js";
import { getMessage } from "../locales/getMessage.js";

//validate
import RoleType from "../types/RoleType/RoleType.js";
import ObjectIdType from "../types/ObjectIdType/ObjectIdType.js";

import Core from "../core/core.js";
import iSessionPayload from "../@types/iSessionPayload/iSessionPayload.js";
import Cryptography from "@luxcrm/lux-core/src/core/Cryptography/Cryptography.js";

const { User, Verification, Prisma } = Core;

//verify login and send user id to next in req.id
async function validateRegisterParams(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session error");

  let email = new EmailType(req.body.email, req.session.locale);

  await email.avaible().catch((err) => {
    throw err;
  });

  let phone = new PhoneType(req.body.phone, req.session.locale);

  await phone.avaible().catch((err) => {
    throw err;
  });

  req.data.email = email.getValue();

  const passwdValidator = new PasswdType(req.body.passwd, req.session.locale);

  req.data.passwd = await passwdValidator.getHash();
  req.data.name = new SmallTextType(
    req.body.name,
    req.session.locale,
  ).getValue();
  req.data.lastName = new SmallTextType(
    req.body.lastName,
    req.session.locale,
  ).getValue();
  req.data.phone = phone.getValue();

  next();
}

async function registerNewUser(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  req.userData = (await User.createNewUser(
    req.session as iSessionPayload,
    req.data.email,
    req.data.name,
    req.data.lastName,
    req.data.phone,
    req.data.passwd,
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
  if (!req.session) throw new errors.InternalServerError("Session error");

  let email = new EmailType(req.body.email, req.session.locale);

  await email.avaible().catch((err) => {
    throw err;
  });

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: getMessage("emailAvaible", req.session.locale),
    },
  };

  next();
}

async function validateUserId(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session error");

  let id = new ObjectIdType(req.params.id, req.session.locale).getValue();

  req.userData = (await User.getUserById(id).catch(next)) as iUser;

  next();
}

async function getUser(req: iRequest, res: Response, next: NextFunction) {
  if (!req.session) throw new errors.InternalServerError("Session error");

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: getMessage("userFound", req.session.locale),
      data: req.userData,
    },
  };

  next();
}

async function getUsers(req: iRequest, res: Response, next: NextFunction) {
  if (!req.session) throw new errors.InternalServerError("Session error");

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

  const users = (await Prisma.user.findMany(query).catch((err) => {
    throw new errors.InternalServerError("Cannot get users in DB.");
  })) as iUser[];

  const publicUsers = users.map((user) => {
    return user;
  });

  const messageKey =
    users.length === 1
      ? "userFound"
      : users.length > 1
        ? "usersFound"
        : "noUsersFound";

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: getMessage(messageKey, req.session.locale, {
        count: users.length,
      }),
      info: {
        lenght: users.length,
        showing: req.data.take,
        skipped: req.data.skip,
      },
      data: publicUsers,
    },
  };

  next();
}

async function countAllUsers(req: iRequest, res: Response, next: NextFunction) {
  if (!req.session) throw new errors.InternalServerError("Session error");
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

  const count = await Prisma.user
    .count({
      where,
    })
    .catch((err) => {
      throw new errors.InternalServerError("Cannot count users in DB.");
    });

  const messageKey =
    count === 1 ? "userFound" : count > 1 ? "usersFound" : "noUsersFound";

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: getMessage(messageKey, req.session.locale, {
        count,
      }),
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
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session error");

  req.data = {};
  req.data.body = {};

  if (req.body.name)
    req.data.body.name = new SmallTextType(
      req.body.name,
      req.session.locale,
    ).getValue();

  if (req.body.lastName)
    req.data.body.lastName = new SmallTextType(
      req.body.lastName,
      req.session.locale,
    ).getValue();

  if (req.body.email) {
    let email = new EmailType(req.body.email, req.session.locale);

    await email.avaible().catch((err) => {
      throw err;
    });

    req.data.body.email = email.getValue();
    req.data.body.emailVerified = false;
  }

  if (req.body.phone) {
    let phone = new PhoneType(req.body.phone, req.session.locale);

    await phone.avaible().catch((err) => {
      throw err;
    });

    req.data.body.phone = phone.getValue();
  }

  if (req.body.passwd) {
    if (!req.body.oldPasswd)
      throw new errors.UserError(
        getMessage("requiresOldPasswd", req.session.locale),
      );

    const passwdValidator = new PasswdType(req.body.passwd, req.session.locale);

    req.data.oldPasswd = new PasswdType(
      req.body.oldPasswd,
      req.session.locale,
    ).getValue();
    req.data.passwd = await passwdValidator.getHash();
  }

  if (req.body.role) {
    if (req.userData?.role !== "ADMIN")
      throw new errors.UserError(
        getMessage("unauthorized", req.session.locale),
      );

    req.data.body.role = new RoleType(
      req.body.role,
      req.session.locale,
    ).getValue();
  }

  if (req.body.active) {
    if (typeof req.body.active !== "boolean")
      throw new errors.UserError(
        getMessage("invalidParams", req.session.locale),
      );

    req.data.body.active = req.body.active;
  }

  if (Object.keys(req.data.body).length === 0) {
    throw new errors.UserError(
      getMessage("obrigatoryParams", req.session.locale),
    );
  }

  next();
}

async function validateUpdateQuery(
  req: iRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) throw new errors.InternalServerError("Session error");
  if (!req.userData) throw new errors.InternalServerError("Userdata error");

  req.data.query = {};

  const privilege =
    req.userData.role === "ADMIN" || req.userData.role === "SUPPORT";

  if (!req.params.query || typeof req.params.query !== "string")
    throw new errors.UserError(getMessage("invalidQuery", req.session.locale));

  if (!privilege)
    throw new errors.AuthError(getMessage("unauthorized", req.session.locale));

  req.data.query = {
    OR: [{ email: req.params.query }, { id: req.params.query }],
  };

  if (Object.keys(req.data.query).length === 0) {
    throw new errors.UserError(getMessage("invalidQuery", req.session.locale));
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
  next: NextFunction,
) {
  if (req.query.search && typeof req.query.search === "string")
    req.data.search = req.query.search;

  next();
}

async function updateUsers(req: iRequest, res: Response, next: NextFunction) {
  if (!req.userData) throw new errors.InternalServerError("Userdata error");
  if (!req.session) throw new errors.InternalServerError("Session error");

  if (req.data.passwd) {
    const userHash = await User.getActivePasswd(
      req.userData,
      req.session.locale,
    );

    const compares = await Cryptography.compare(
      req.data.oldPasswd,
      userHash.hash,
    );

    if (!compares) {
      throw new errors.UserError(
        getMessage("invalidPasswd", req.session.locale),
      );
    }

    await User.changePassword(
      req.userData,
      req.data.passwd,
      req.session,
      req.session.locale,
    );
  }

  await Prisma.user
    .updateMany({
      where: req.data.query,
      data: req.data.body,
    })
    .catch((err) => {
      console.log(err);
      throw new errors.InternalServerError("Cannot edit users in DB.");
    });

  if (req.data.body.email) {
    const verification = await Verification.generate2faLink(
      req.userData,
      req.session,
      "VERIFICATION",
    ).catch((err) => {
      throw new errors.InternalServerError(
        "Não foi possível gerar o código de verificação do email.",
      );
    });

    await Verification.sendTransacionalEmail(
      req.userData,
      verification,
      req.session,
    ).catch((err) => {
      throw new errors.InternalServerError(
        "Não foi possível enviar o código de verificação do email.",
      );
    });
  }

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: getMessage("updated"),
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
