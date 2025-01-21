//obrigatory for middlewares
import prisma from "../controllers/db.controller.js";
import crypt from "../core/crypt.js";
import errors from "../errors/errors.js";

//optional
import { randomInt } from "crypto";

async function validateStringParams(req, res, next) {
  Object.values(req.body).filter((param) => {
    if (typeof param != "string")
      throw new errors.UserError("Campos devem ser do tipo string.");
  });

  next();
}

//verify in db and generate verification code with expiresOn
async function generateVerificationCode(req, res, next) {
  //set expire time
  let expiresOn = new Date(Date.now());
  expiresOn.setDate(expiresOn.getDate() + 1);

  //gen code
  let code = randomInt(100000, 999999).toString();

  //verify if exists another code
  let q = await prisma.verificationCode.findUnique({
    where: {
      userId: req.id,
    },
  });

  let generate = {};

  if (q) {
    //get wait time
    let timeout = new Date(q.updatedAt);
    timeout.setMinutes(timeout.getMinutes() + 1);

    let now = new Date(Date.now());

    //verify if waited the time
    if (timeout.getTime() > now.getTime()) {
      let secondAwait = (timeout.getTime() - now.getTime()) / 1000;

      throw new errors.UserError("Tente novamente em 1 minuto.");
    }

    //update a existent code
    generate = await prisma.verificationCode.update({
      where: {
        userId: req.id,
      },
      data: {
        code,
        expiresOn,
        user: {
          connect: {
            id: req.id,
          },
        },
      },
    });
  } else {
    //generate code
    generate = await prisma.verificationCode.create({
      data: {
        code,
        expiresOn,
        user: {
          connect: {
            id: req.id,
          },
        },
      },
    });
  }

  req.emailVerificationCode = code;
  next();
}

async function validatePasswdRecoveryCode(req, res, next) {
  let { passwdRecoveryCode } = req.body;

  //verify if required param is ok
  if (!passwdRecoveryCode)
    throw new errors.UserError("Código de recuperação de senha obrigatório.");

  //verify code length
  if (passwdRecoveryCode.length != 6) {
    throw new errors.UserError("O código deve ter 6 números.");
  }

  //query user data
  let q = await prisma.verificationCode.findUnique({
    where: {
      userId: req.id,
    },
  });

  if (!q)
    throw new errors.UserError("Não existe código nenhum a ser verificado.");

  //verify if code is equal the real
  if (passwdRecoveryCode != q.code) {
    throw new errors.UserError("Código de verificação inválido.");
  }

  //verify if expired
  let expiredTime = new Date(q.expiresOn);
  let now = new Date(Date.now());

  if (expiredTime.getTime() < now.getTime()) {
    throw new errors.UserError("Código expirado.");
  }

  //delete codes
  await prisma.verificationCode.delete({
    where: {
      userId: req.id,
    },
  });

  next();
}

async function getUserbyEmail(req, res, next) {
  //vrify if is authenticated
  if (req.headers["Authorization"])
    throw new errors.UserError("Autenticação inválida.");

  let { email } = req.body;

  //verify if email exists
  if (!email) throw new errors.UserError("Campo de email obrigatório.");

  //find userdata
  req.userData = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  //if email not founded
  if (!req.userData) throw new errors.UserError("Email inexistente.");

  //send id to next
  req.id = req.userData.id;

  next();
}

export default {
  generateVerificationCode,
  validatePasswdRecoveryCode,
  getUserbyEmail,
  validateStringParams,
};
