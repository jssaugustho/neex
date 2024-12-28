//obrigatory for middlewares
import { error } from "console";
import prisma from "../controllers/db.controller.js";
import crypt from "../core/crypt.js";
import errors from "../errors/errors.js";

import response from "../response/response.js";
import fs from "fs";

import { isValidObjectId } from "mongoose";

async function validateStringParams(req, res, next) {
  Object.values(req.body).filter((param) => {
    if (typeof param != "string")
      throw new errors.UserError(response.invalidParam(param));
    if (param.length > 256)
      throw new errors.UserError(response.invalidParam(param));
  });

  next();
}

//verify login and send user id to next in req.id
async function validateRegisterParams(req, res, next) {
  let lostParams = [];
  //verify params
  if (!req.body.name) lostParams.push("nome");
  if (!req.body.email) lostParams.push("email");
  if (!req.body.phone) lostParams.push("phone");
  if (!req.body.passwd) lostParams.push("senha");
  if (!req.body.confirmPasswd) lostParams.push("confirmação da senha");

  //verify lost params and throw error
  if (lostParams.length > 0) {
    throw new errors.UserError(response.obrigatoryParam(lostParams));
  }

  if (!isValidObjectId(req.body.support)) delete req.body.support;
  //query user data
  let findEmail = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  //verify if email exists
  if (findEmail) {
    throw new errors.UserError(response.emailInUse());
  }

  //verify passwd length
  if (req.body.passwd.length > 32 || req.body.passwd.length < 8) {
    throw new errors.UserError(response.invalidPasswdLength(16, 32));
  }

  //verify passwd match
  if (req.body.passwd != req.body.confirmPasswd) {
    throw new errors.UserError(response.notMatchPasswd());
  }

  let quiz = JSON.parse(await fs.readFileSync("./json_models/quiz.json"));

  req.registerData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    passwd: crypt.criptografar(req.body.passwd),
    quiz: {
      create: {
        slug: "quiz",
        steps: quiz.steps,
      },
    },
  };

  req.registerData.support = {};
  req.registerData.support[process.env.ADMIN_EMAIL] = {
    privilege: "SUPPORT",
  };

  //verificar parametro suporte
  if (req.body.support) {
    let findByEmail = prisma.user.findUnique({
      where: { email: req.body.support },
    });

    if (findByEmail) {
      req.registerData.support[req.body.support] = {
        privilege: "SUPPORT",
      };
    }
  }

  next();
}

//validate update params
async function validateUpdateParams(req, res, next) {
  req.updateData = {};
  req.where = { id: req.userData.id };
  req.requiresPasswd = true;

  //validar o id
  if (req.params.id) {
    let q = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });

    let aproved = false;

    if (req.userData.email in q.support) aproved = true;

    if (req.userData.role == "ADMIN") aproved = true;

    req.where = {
      id: q.id,
    };
    req.requiresPasswd = false;
  }

  //verify name
  if (req.body.name) {
    req.updateData.name = req.body.name;
  }

  //validating email param
  if (req.body.email) {
    //verify email length
    req.updateData = req.body.email;
    //set emailVerified false in database
    req.updateData.emailVerified = false;
  }

  if (req.body.phone) req.updateData = req.body.phone;

  if (req.body.newPasswd)
    req.updateData.passwd = crypt.criptografar(req.body.newPasswd);

  if (isValidObjectId(req.body.support)) req.updateData = req.body.support;

  if (req.requiresPasswd) {
    //validating Passwd params
    if (req.body.newPasswd) {
      //verify actual passwd
      let { passwd } = req.body;

      if (!passwd)
        throw new errors.UserError(response.obrigatoryParam("senha"));

      //validate passwd
      if (req.userData.passwd != crypt.criptografar(req.body.passwd))
        throw new errors.UserError(response.incorrectPasswd());

      if (req.body.passwd.length > 32 || req.body.passwd < 8)
        throw new errors.UserError(response.invalidPasswdLength(16, 32));
    }
  }

  if (Object.keys(req.updateData).length == 0)
    throw new errors.UserError("Pelo menos um campo obrigatório.");

  next();
}

//validate password
async function validatePasswdDelete(req, res, next) {
  let lostParams = [];

  if (req.requiresPasswd) {
    if (!req.body.passwd)
      throw new errors.UserError(response.obrigatoryParam("passwd"));

    let q = await prisma.user.findUnique({
      where: {
        id: req.id,
      },
    });

    if (crypt.criptografar(passwd) != q.passwd)
      throw new errors.UserError(response.incorrectPasswd());
  }

  next();
}

async function validateDelete(req, res, next) {
  if (req.params.id) {
    if (isValidObjectId(req.params.id))
      throw new errors.UserError(response.userNotFound());

    let q = await prisma.user.findUnique({ where: { id: req.params.id } });

    if (!q.support[req.userData.email])
      throw new errors.AuthError(response.unauthorizated());

    req.dbQuery = {
      where: {
        id: req.params.id,
      },
    };
  } else {
    req.dbQuery = {
      where: {
        id: req.userData.id,
      },
    };
    req.requiresPasswd = true;
  }
  next();
}

async function userPrivileges(req, res, next) {
  if (req.body.id) {
    if (isValidObjectId(req.body.id)) {
      let q = await prisma.user.findUnique({
        where: {
          id: req.body.id,
        },
      });

      let aproved = false;

      if (q.support[req.id].privilege == "SUPPORT") aproved = true;
      if (req.userData.role == "ADMIN") aproved = true;

      if (!aproved) throw new errors.AuthError("Não autorizado.");

      if (!q) throw new errors.UserError("Usuário não encontrado.");

      req.updateUserId = req.body.id;
      next();
    } else {
      throw new errors.UserError("Id inválido.");
    }
  } else {
    req.requiresPasswd = true;
    req.updateUserId = req.id;
    next();
  }
}

async function validateId(req, res, next) {
  req.dbQuery = {
    where: { id: req.userData.id },
  };

  if (req.path.split("/")[1] == "users") {
    if (req.params.id) {
      if (!isValidObjectId(req.params.id))
        throw new errors.UserError(response.userNotFound());
      req.dbQuery.where = { id: req.params.id };
    } else req.dbQuery.where = {};
  }

  next();
}

async function validateSortBy(req, res, next) {
  let aproved = { updatedAt: true, createdAt: true };
  let aprovedSort = { asc: true, desc: true };
  let sort = "desc";

  if (req.query.sort in aprovedSort) sort = req.query.sort;

  req.dbQuery.orderBy = {
    updatedAt: sort,
  };

  if (req.query.orderBy in aproved) {
    req.dbQuery.orderBy = {};
    req.dbQuery.orderBy[req.query.orderBy] = sort;
  }

  if (req.query.take >= 0)
    req.dbQuery.take = new Number(req.query.take).valueOf();

  if (req.query.skip >= 0)
    req.dbQuery.skip = new Number(req.query.skip).valueOf();

  next();
}

async function validateDeleteId(req, res, next) {
  req.dbQuery = {
    where: { id: req.userData.id },
  };

  if (req.path.split("/")[1] == "users") {
    if (req.params.id) {
      if (!isValidObjectId(req.params.id))
        throw new errors.UserError(response.userNotFound());
      req.deleteId = req.params.id;
    } else throw new errors.UserError(response.userNotFound());
  }

  next();
}

export default {
  validateRegisterParams,
  validateUpdateParams,
  validatePasswdDelete,
  validateStringParams,
  userPrivileges,
  validateId,
  validateDeleteId,
  validateDelete,
  validateSortBy,
};
