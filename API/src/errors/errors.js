class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "InternalServerError";
    this.message = message;
  }
  status = 502;
}

class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserError";
    this.message = message;
  }
  status = 400;
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
    this.message = message;
  }
  status = 401;
}

class TokenError extends Error {
  constructor(message) {
    super(message);
    this.name = "TokenError";
    this.message = message;
  }
  status = 401;
}

function response(err, req, res, next) {
  if (err.status) {
    return res.status(err.status).send({
      status: err.name,
      message: err.message,
    });
  }
  if (err) {
    return res.status(502).send({
      status: "InternalServerError",
      message: "Erro interno, tente novamente.",
    });
  }
  next();
}

export default {
  UserError,
  InternalServerError,
  AuthError,
  TokenError,
  response,
};
