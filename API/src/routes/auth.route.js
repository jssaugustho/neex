import { Router } from "express";

//controle de acesso e autenticação
import authMiddlewares from "../middlewares/auth.middlewares.js";
import authControllers from "../controllers/auth.controllers.js";

// controles da rota
import userMiddlewares from "../middlewares/user.middlewares.js";

const auth = Router();

//para tratamento de erros em funções async
function resolver(handlerFn) {
  return (req, res, next) => {
    return Promise.resolve(handlerFn(req, res, next)).catch((e) => next(e));
  };
}

//login
auth.post(
  "/login",
  resolver(userMiddlewares.validateStringParams),
  resolver(authMiddlewares.validateLogin),
  resolver(authControllers.auth)
);

//refresh token
auth.post(
  "/refresh",
  resolver(userMiddlewares.validateStringParams),
  resolver(authMiddlewares.validateRefreshToken),
  resolver(authControllers.auth)
);

export default auth;
