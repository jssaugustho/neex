//obrigatory for middlewares
import prisma from "../controllers/db.controller.js";
import crypt from "../core/crypt.js";
import errors from "../errors/errors.js";

//optional
import jwt, { decode } from "jsonwebtoken";
import response from "../response/response.js";

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

  if (lostParams.length > 0) {
    throw new errors.UserError(response.obrigatoryParam(lostParams));
  }

  //find user in  db by email
  let q = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  //verify if email exists
  if (!q) {
    throw new errors.UserError(response.emailNotExists());
  }

  //encrypt received passwd
  let encryptedInPasswd = crypt.criptografar(passwd);

  //verify if is correctly passwd
  if (q.passwd != encryptedInPasswd) {
    throw new errors.AuthError(response.incorrectPasswd());
  }

  //send userData to next
  req.userData = q;

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
async function verifyToken(req, res, next) {
  //verify if header exists
  if (!req.headers["authorization"]) {
    throw new errors.AuthError(response.needAuth());
  }

  //get token
  let token = req.headers["authorization"].split(" ")[1];

  //verify sign
  let payload = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    //verify err

    let m = !err ? null : err.message;

    if (m == "jwt malformed") throw new errors.AuthError(response.authError());

    if (m == "jwt expired") throw new errors.AuthError(response.expiredToken());

    //verify if sign fail
    if (!decoded) throw new errors.AuthError(response.invalidToken());

    req.userId = decoded.id;
  });

  const userData = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });

  delete req.userId;

  if (!userData) {
    throw new errors.UserError(response.authError());
  }

  req.userData = userData;

  next();
}

async function isEmailVerified(req, res, next) {
  if (!req.userData.emailVerified)
    throw new errors.UserError(response.verifyYourEmail());

  next();
}

export default {
  validateLogin,
  validateRefreshToken,
  verifyToken,
  isEmailVerified,
};
