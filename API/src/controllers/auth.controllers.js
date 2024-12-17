//obrigatory for controllers
import prisma from "./db.controller.js";

//optional
import jwt from "jsonwebtoken";

//auth user, register and send token
async function auth(req, res, next) {
  let userId = req.id;

  //sign token
  let token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: 1 * 60 * 20, //20 minutos
  });

  //sign refresh token with randon bytes
  let refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: 1 * 60 * 60, //1 hora
  });

  //verify if exists another token in db
  let lastToken = await prisma.token.findUnique({
    where: { userId },
  });

  //if token exists in db update else create new
  if (!lastToken) {
    await prisma.token.create({
      data: {
        token: refreshToken,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } else {
    await prisma.token.update({
      where: {
        userId,
      },
      data: {
        token: refreshToken,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  //retornar tokens
  return res.status(200).send({
    status: "Ok",
    message: "Autenticado com sucesso.",
    token: "bearer " + token,
    refreshToken,
  });
}

export default {
  auth,
};
