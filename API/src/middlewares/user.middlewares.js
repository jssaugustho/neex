//obrigatory for middlewares
import prisma from "../controllers/db.controller.js";
import crypt from "../crypt.js";
import errors from "../errors.js";

import { isValidObjectId } from "mongoose";

async function validateStringParams(req, res, next) {
  Object.values(req.body).filter((param) => {
    if (typeof param != "string")
      throw new errors.UserError("Campos devem ser do tipo string.");
  });

  next();
}

//verify login and send user id to next in req.id
async function validateRegister(req, res, next) {
  let lostParams = [];
  //verify params
  if (!req.body.email) lostParams.push("nome");
  if (!req.body.email) lostParams.push("email");
  if (!req.body.phone) lostParams.push("phone");
  if (!req.body.email) lostParams.push("senha");
  if (!req.body.email) lostParams.push("confirmação da senha");

  //verify lost params and throw error
  if (lostParams.length > 0) {
    let msg = "Campos obrigatórios: " + lostParams.join(", ");
    throw new errors.UserError(msg);
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
    throw new errors.UserError("Email em uso.");
  }

  //verify passwd length
  if (req.body.passwd.length > 32 && req.body.passwd.length < 8) {
    throw new errors.UserError("A senha deve ter entre 16 e 32 caracteres.");
  }

  //verify passwd match
  if (req.body.passwd != req.body.confirmPasswd) {
    throw new errors.UserError("As senhas não combinam.");
  }

  next();
}

//validate update params
async function validateUpdateParams(req, res, next) {
  let data = {};
  req.updatedParams = {};

  //verify name
  if (req.body.name) {
    //verify name length
    if (req.body.name.length > 128)
      throw new errors.UserError("Tamanho de nome máximo: 128 caracteres.");

    req.updatedParams.name = req.body.name;
    data.name = req.body.name;
  }

  //validating email param
  if (req.body.email) {
    //verify email length
    if (req.body.email.length > 128)
      throw new errors.UserError("Tamanho de email máximo: 128 caracteres.");

    req.updatedParams.email = req.body.email;
    data.email = req.body.email;

    //set emailVerified false in database
    data.emailVerified = false;
  }

  if (req.body.phone) {
    if (req.body.phone.length > 128)
      throw new errors.UserError("Tamanho de celular máximo: 128 caracteres.");

    req.updatedParams.phone = req.body.phone;
    data.phone = req.body.phone;
  }

  if (isValidObjectId(req.body.support)) {
    if (req.body.support.length > 24)
      throw new errors.UserError(
        "Campo support inválido: tamanho de id máximo 24 caracteres."
      );

    req.updatedParams.support = req.body.support;
    data.support = req.body.support;
  }

  //validating Passwd params
  if (req.body.newPasswd) {
    //verify actual passwd
    let { passwd } = req.body;
    let lostParams = [];

    if (req.requiresPasswd) {
      if (!passwd) lostParams.push("senha");

      if (lostParams.length > 0)
        throw new errors.UserError(
          "Campos obrigatórios: " + lostParams.join(", ")
        );
    }

    //data sent to next
    data.passwd = req.body.newPasswd;

    //validate new password length
    if (data.passwd.length > 32 && data.passwd.length < 8)
      throw new errors.UserError("A senha deve ter entre 8 e 32 caracteres");

    req.updatedParams.passwd = "***************";
    data.passwd = crypt.criptografar(req.body.newPasswd);
  }

  if (Object.keys(data).length == 0)
    throw new errors.UserError("Pelo menos um campo obrigatório.");

  req.body = data;
  next();
}

//validate password
async function validatePasswd(req, res, next) {
  let { passwd } = req.body;
  let lostParams = [];

  if (!passwd) lostParams.push("senha");

  if (lostParams.length > 0)
    throw new errors.UserError("Campos obrigatórios: " + lostParams.join(", "));

  let q = await prisma.user.findUnique({
    where: {
      id: req.id,
    },
  });

  if (crypt.criptografar(passwd) != q.passwd)
    throw new errors.UserError("Senha incorreta.");

  req.userData = q;

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

      if (q.support == req.id && req.userData.role == "SUPPORT") aproved = true;
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

export default {
  validateRegister,
  validateUpdateParams,
  validatePasswd,
  validateStringParams,
  userPrivileges,
};
