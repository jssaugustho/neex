//obrigatory for middlewares
import prisma from "../controllers/db.controller.js";
import errors from "../errors.js";

//optional
import { randomInt } from "crypto";

//verify if parameters are strings
async function validateStringParams(req, res, next) {
  Object.values(req.body).filter((param) => {
    if (typeof param != "string")
      throw new errors.UserError("Campos devem ser do tipo string.");
  });

  next();
}

//validate email verification code after auth
async function validateVerifyEmailCode(req, res, next) {
  let { emailVerificationCode } = req.body;

  //verify required param
  if (!emailVerificationCode)
    throw new errors.UserError("Código de verificação do email obrigatório.");

  //query verification code
  let q = await prisma.VerificationCode.findUnique({
    where: {
      userId: req.id,
    },
  });

  //verfy if is verfied
  if (req.userData.emailVerified)
    throw new errors.UserError("Email já verificado.");

  //verify code length
  if (emailVerificationCode.length != 6) {
    throw new errors.UserError("O código de verificação deve ter 6 números.");
  }

  //verify if code is equal the real
  if (emailVerificationCode != q.code) {
    throw new errors.UserError("Código inválido.");
  }

  //verify if expired
  let expiredTime = new Date(q.expiresOn);
  let now = new Date(Date.now());

  if (expiredTime.getTime() < now.getTime()) {
    throw new errors.UserError("Código expirado.");
  }

  //delete codes
  await prisma.VerificationCode.delete({
    where: {
      userId: req.id,
    },
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
  let q = await prisma.VerificationCode.findUnique({
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

      throw new errors.UserError(
        "Aguarde: " + secondAwait + " segundos para tentar novamente."
      );
    }

    //update a existent code
    generate = await prisma.VerificationCode.update({
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
    generate = await prisma.VerificationCode.create({
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

async function validateResend(req, res, next) {
  if (req.userData.emailVerified)
    throw new errors.UserError("Email já verificado.");

  next();
}

export default {
  validateVerifyEmailCode,
  generateVerificationCode,
  validateResend,
  validateStringParams,
};
