//obrigatory for middlewares
import prisma from "../controllers/db.controller.js";
import crypt from "../crypt.js";
import errors from "../errors.js";

//optional
import jwt, { decode } from "jsonwebtoken";

//verify login and send user id to next in req.id
async function validateLogin(req, res, next) {
  let { email, passwd } = req.body;

  //validate params
  let lostParams = [];

  if (!email) {
    lostParams.push("email");
  }

  if (!passwd) {
    lostParams.push("senha");
  }

  let p = lostParams.length > 1 ? "Campos obrigatórios" : "Campo obrigatório";

  if (lostParams.length > 0) {
    throw new errors.UserError(p + ": " + lostParams.join(", "));
  }

  //find user in  db by email
  let q = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  //verify if email exists
  if (!q) {
    throw new errors.UserError("Email não existe");
  }

  //encrypt received passwd
  let encryptedInPasswd = crypt.criptografar(passwd);

  //verify if is correctly passwd
  if (q.passwd != encryptedInPasswd) {
    throw new errors.AuthError("Senha incorreta.");
  }

  //send id param to next
  req.id = q.id;

  next();
}

//verify token and send id to next in req.id
async function validateRefreshToken(req, res, next) {
  let { refreshToken } = req.body;

  //verifify if token exists
  if (!refreshToken) {
    throw new errors.UserError("Campo obrigatório: refreshToken");
  }

  //verify signature
  let payload = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    (err, decoded) => {
      if (err) throw new errors.AuthError("refreshToken inválido.");
      return decoded;
    }
  );

  //buscar no banco de dados
  let find = await prisma.token.findUnique({
    where: { token: refreshToken },
  });

  //verify if token is in database
  if (!find) {
    throw new errors.AuthError("refreshToken expirado.");
  }

  //send userdata to next
  req.userData = payload;

  //send id param to next
  req.id = payload.id;

  next();
}

//verify active token and send id to next in req.id
async function accessControl(req, res, next) {
  //verify if header exists
  if (!req.headers["authorization"]) {
    throw new errors.AuthError("Necessita de autenticação.");
  }

  //get token
  let token = req.headers["authorization"].split(" ")[1];

  //verify sign
  let payload = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    //verify err

    let m = !err ? null : err.message;

    if (m == "jwt malformed")
      throw new errors.AuthError("Erro na autenticação.");

    if (m == "jwt expired") throw new errors.AuthError("Token expirado.");

    //verify if sign fail
    if (!decoded) throw new errors.AuthError("Token inválido.");

    req.id = decoded.id;
  });

  const userData = await prisma.user.findUnique({
    where: {
      id: req.id,
    },
  });

  if (!userData) {
    throw new errors.UserError("Erro na autenticação.");
  }

  req.userData = userData;

  next();
}

async function isEmailVerified(req, res, next) {
  if (!req.userData.emailVerified)
    throw new errors.UserError("Verifique o seu email.");

  next();
}

export default {
  validateLogin,
  validateRefreshToken,
  accessControl,
  isEmailVerified,
};
