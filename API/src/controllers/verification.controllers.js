//obrigatory for controllers
import prisma from "./db.controller.js";

async function setEmailVerified(req, res, next) {
  let id = req.userData.id;

  //update user
  let update = await prisma.user.update({
    where: { id },
    data: { emailVerified: true },
  });

  next();
}

async function sendVerificationEmailResponse(req, res, next) {
  return res.status(200).send({
    status: "Ok",
    message: "Código enviado para: " + req.userData.email,
  });
}

export default {
  setEmailVerified,
  sendVerificationEmailResponse,
};
