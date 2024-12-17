//obrigatory for controllers
import prisma from "./db.controller.js";

async function setEmailVerified(req, res, next) {
  let id = req.id;

  //update user
  let update = await prisma.user.update({
    where: { id },
    data: { emailVerified: true },
  });

  next();
}

async function recoveryPasswdResponse(req, res, next) {
  return res.status(200).send({
    status: "Ok",
    msg: "Código de recuperação enviado no seu e-mail.",
  });
}

export default {
  setEmailVerified,
  recoveryPasswdResponse,
};
