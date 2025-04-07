//db
import prisma from "../controllers/db.controller.js";

//types
import { NextFunction, Response } from "express";
import iRequest from "../@types/iRequest/iRequest.js";

//core
import EmailType from "../types/EmailType/EmailType.js";
import PasswdType from "../types/PasswdType/PasswdType.js";
import SmallTextType from "../types/SmallTextType/SmallText.js";
import PhoneType from "../types/PhoneType/PhoneType.js";
import User from "../core/User/User.js";

//errors
import errors from "../errors/errors.js";
import response from "../response/response.js";
import Session from "../core/Session/Session.js";
import { get } from "http";
import ObjectIdType from "../types/ObjectIdType/ObjectIdType.js";
import RoleType from "../types/RoleType/RoleType.js";
import { error } from "console";

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

  req.data.email = email.getValue();
  req.data.passwd = new PasswdType(req.body.passwd).getValue();
  req.data.name = new SmallTextType(req.body.name).getValue();
  req.data.lastName = new SmallTextType(req.body.lastName).getValue();
  req.data.phone = new PhoneType(req.body.phone).getValue();

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

async function registerNewUser(
  req: iRequest,
  res: Response,
  next: NextFunction
) {
  const { session, user } = await User.createNewUser(
    req.data.email,
    req.data.name,
    req.data.lastName,
    req.data.phone,
    req.data.passwd,
    req.data.ipLookup,
    req.data.fingerprint
  ).catch((err) => {
    throw err;
  });

  req.session = session;
  req.userData = user;
  req.data.firstTime = true;

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
      message: "Usuário encontrado.",
      data: req.userData,
    },
  };

  next();
}

async function getAllUsers(req: iRequest, res: Response, next: NextFunction) {
  const users = await prisma.user.findMany().catch((err) => {
    throw new errors.InternalServerError("Cannot get users in DB.");
  });

  const publicUsers = users.map((user) => {
    user.passwd = "*************************************";

    return user;
  });

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: "Usuários encontrados.",
      info: {
        lenght: users.length,
      },
      data: publicUsers,
    },
  };

  next();
}

async function countAllUsers(req: iRequest, res: Response, next: NextFunction) {
  const count = await prisma.user.count().catch((err) => {
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

  if (req.body.data?.name)
    req.data.body.name = new SmallTextType(req.body.data.name).getValue();

  if (req.body.data?.lastName)
    req.data.body.lastName = new SmallTextType(
      req.body.data.lastName
    ).getValue();

  if (req.body.data?.email) {
    let email = new EmailType(req.body.data.email);

    await email.avaible().catch((err) => {
      throw err;
    });

    req.data.body.email = email.getValue();
    req.data.body.emailVerified = false;
  }

  if (req.body.data?.phone)
    req.data.body.phone = new PhoneType(req.body.data.phone).getValue();

  if (req.body.data?.passwd)
    req.data.body.passwd = new PasswdType(req.body.data.passwd).getValue();

  if (req.body.data?.role) {
    if (req.userData?.role !== "ADMIN")
      throw new errors.UserError(response.unauthorizated());

    req.data.body.role = new RoleType(req.body.data.role).getValue();
  }

  if (req.body.data?.active) {
    if (req.userData?.role !== "ADMIN")
      throw new errors.UserError(response.unauthorizated());

    if (typeof req.body.data?.active !== "boolean")
      throw new errors.UserError(response.invalidParam("active"));

    req.data.body.active = req.body.data.active;
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

  if (!req.body.query) throw new errors.UserError(response.needOneQueryParam());

  if (req.body.query.id)
    req.data.query.id = new ObjectIdType(req.body.query.id).getValue();

  if (req.body.query.email)
    req.data.query.email = new EmailType(req.body.query.email).getValue();

  if (Object.keys(req.data.query).length === 0) {
    throw new errors.UserError(response.needOneQueryParam());
  }

  next();
}

async function updateUser(req: iRequest, res: Response, next: NextFunction) {
  const user = await prisma.user
    .updateMany({
      where: req.data.query,
      data: req.data.body,
    })
    .catch((err) => {
      throw new errors.InternalServerError("Cannot edit users in DB.");
    });

  req.response = {
    statusCode: 200,
    output: {
      status: "Ok",
      message: "Usuários atualizados.",
      info: {
        count: user.count,
      },
    },
  };

  next();
}

async function verifyAdmin(req: iRequest, res: Response, next: NextFunction) {
  if (req.userData?.role !== "ADMIN")
    throw new errors.AuthError(response.unauthorizated());

  next();
}

// //validate update params
// async function validateUpdateParams(
//   req: iRequest,
//   res: Response,
//   next: NextFunction
// ) {
//   req.updateData = {};
//   req.where = { id: req.userData.id };
//   req.requiresPasswd = true;

//   //validar o id
//   if (req.params.id) {
//     let q = await prisma.user.findUnique({
//       where: {
//         id: req.params.id,
//       },
//     });

//     let aproved = false;

//     if (req.userData.email in q.support) aproved = true;

//     if (req.userData.role == "ADMIN") aproved = true;

//     req.where = {
//       id: q.id,
//     };
//     req.requiresPasswd = false;
//   }

//   //verify name
//   if (req.body.name) {
//     req.updateData.name = req.body.name;
//   }

//   //validating email param
//   if (req.body.email) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(req.body.email))
//       throw new errors.UserError(response.invalidParam("Email"));

//     let q = await prisma.user.findUnique({
//       where: {
//         email: req.body.email,
//       },
//     });

//     await prisma.verificationCode.deleteMany({
//       where: {
//         userId: req.userData.id,
//       },
//     });

//     if (q) throw new errors.UserError(response.emailInUse());

//     //verify email length
//     req.updateData.email = req.body.email;

//     //set emailVerified false in database
//     req.updateData.emailVerified = false;
//   }

//   if (req.body.phone) req.updateData = req.body.phone;

//   if (req.body.newPasswd)
//     req.updateData.passwd = crypt.criptografar(req.body.newPasswd);

//   if (isValidObjectId(req.body.support)) req.updateData = req.body.support;

//   if (req.requiresPasswd) {
//     //validating Passwd params
//     if (req.body.newPasswd) {
//       //verify actual passwd
//       let { passwd } = req.body;

//       if (!passwd)
//         throw new errors.UserError(response.obrigatoryParam("senha"));

//       //validate passwd
//       if (req.userData.passwd != crypt.criptografar(req.body.passwd))
//         throw new errors.UserError(response.incorrectPasswd());

//       if (req.body.passwd.length > 32 || req.body.passwd < 8)
//         throw new errors.UserError(response.invalidPasswdLength(16, 32));
//     }
//   }

//   if (Object.keys(req.updateData).length == 0)
//     throw new errors.UserError("Pelo menos um campo obrigatório.");

//   next();
// }

// //validate password
// async function validatePasswdDelete(
//   req: iRequest,
//   res: Response,
//   next: NextFunction
// ) {
//   let lostParams = [];

//   if (req.requiresPasswd) {
//     if (!req.body.passwd)
//       throw new errors.UserError(response.obrigatoryParam("passwd"));

//     let q = await prisma.user.findUnique({
//       where: {
//         id: req.id,
//       },
//     });

//     if (crypt.criptografar(passwd) != q.passwd)
//       throw new errors.UserError(response.incorrectPasswd());
//   }

//   next();
// }

// async function validateDelete(
//   req: iRequest,
//   res: Response,
//   next: NextFunction
// ) {
//   if (req.params.id) {
//     if (isValidObjectId(req.params.id))
//       throw new errors.UserError(response.userNotFound());

//     let q = await prisma.user.findUnique({ where: { id: req.params.id } });

//     if (!q.support[req.userData.email])
//       throw new errors.AuthError(response.unauthorizated());

//     req.dbQuery = {
//       where: {
//         id: req.params.id,
//       },
//     };
//   } else {
//     req.dbQuery = {
//       where: {
//         id: req.userData.id,
//       },
//     };
//     req.requiresPasswd = true;
//   }
//   next();
// }

// async function userPrivileges(
//   req: iRequest,
//   res: Response,
//   next: NextFunction
// ) {
//   if (req.body.id) {
//     if (isValidObjectId(req.body.id)) {
//       let q = await prisma.user.findUnique({
//         where: {
//           id: req.body.id,
//         },
//       });

//       let aproved = false;

//       if (q.support[req.id].privilege == "SUPPORT") aproved = true;
//       if (req.userData.role == "ADMIN") aproved = true;

//       if (!aproved) throw new errors.AuthError("Não autorizado.");

//       if (!q) throw new errors.UserError("Usuário não encontrado.");

//       req.updateUserId = req.body.id;
//       next();
//     } else {
//       throw new errors.UserError("Id inválido.");
//     }
//   } else {
//     req.requiresPasswd = true;
//     req.updateUserId = req.id;
//     next();
//   }
// }

// async function validateId(req: iRequest, res: Response, next: NextFunction) {
//   req.dbQuery = {
//     where: { id: req.userData.id },
//   };

//   if (req.path.split("/")[1] == "users") {
//     if (req.params.id) {
//       if (!isValidObjectId(req.params.id))
//         throw new errors.UserError(response.userNotFound());
//       req.dbQuery.where = { id: req.params.id };
//     } else req.dbQuery.where = {};
//   }

//   next();
// }

// async function validateSortBy(
//   req: iRequest,
//   res: Response,
//   next: NextFunction
// ) {
//   let aproved = { updatedAt: true, createdAt: true };
//   let aprovedSort = { asc: true, desc: true };
//   let sort = "desc";

//   if (req.query.sort in aprovedSort) sort = req.query.sort;

//   req.dbQuery.orderBy = {
//     updatedAt: sort,
//   };

//   if (req.query.orderBy in aproved) {
//     req.dbQuery.orderBy = {};
//     req.dbQuery.orderBy[req.query.orderBy] = sort;
//   }

//   if (req.query.take >= 0)
//     req.dbQuery.take = new Number(req.query.take).valueOf();

//   if (req.query.skip >= 0)
//     req.dbQuery.skip = new Number(req.query.skip).valueOf();

//   next();
// }

// async function validateDeleteId(
//   req: iRequest,
//   res: Response,
//   next: NextFunction
// ) {
//   req.dbQuery = {
//     where: { id: req.userData.id },
//   };

//   if (req.path.split("/")[1] == "users") {
//     if (req.params.id) {
//       if (!isValidObjectId(req.params.id))
//         throw new errors.UserError(response.userNotFound());
//       req.deleteId = req.params.id;
//     } else throw new errors.UserError(response.userNotFound());
//   }

//   next();
// }

export default {
  validateRegisterParams,
  verifyAdmin,
  registerNewUser,
  emailExists,
  getUser,
  getAllUsers,
  countAllUsers,
  updateUser,
  validateUpdateParams,
  validateUpdateQuery,
};
