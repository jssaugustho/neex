import { Router } from "express";

//controle de acesso e autenticação
import authMiddlewares from "../middlewares/auth.middlewares.js";
import authControllers from "../controllers/auth.controllers.js";

// controles da rota
import userMiddlewares from "../middlewares/user.middlewares.js";
import userControllers from "../controllers/user.controllers.js";

// controle globais
import emailControllers from "../controllers/email.controllers.js";

//só para gerar o código de verificação
import verificationMiddlewares from "../middlewares/verification.middlewares.js";
import { access } from "fs";

const users = Router();

//para tratamento de erros em funções async
function resolver(handlerFn) {
  return (req, res, next) => {
    return Promise.resolve(handlerFn(req, res, next)).catch((e) => next(e));
  };
}

users.get(
  "/user",
  resolver(authMiddlewares.verifyToken),
  resolver(userMiddlewares.validateId),
  resolver(userControllers.getUserbyQuery)
);

users.get(
  "/users",
  resolver(authMiddlewares.verifyToken),
  resolver(userMiddlewares.validateId),
  resolver(userMiddlewares.validateSortBy),
  resolver(userControllers.getUserbyQuery)
);

users.get(
  "/users/:id",
  resolver(authMiddlewares.verifyToken),
  resolver(userMiddlewares.validateId),
  resolver(userControllers.getUserbyQuery)
);

users.post(
  "/user",
  resolver(userMiddlewares.validateStringParams),
  resolver(userMiddlewares.validateRegisterParams),
  resolver(userControllers.registerNewUser),
  resolver(verificationMiddlewares.generateVerificationCode),
  resolver(emailControllers.sendVerificationCode),
  resolver(authControllers.auth)
);

users.put(
  "/user",
  resolver(authMiddlewares.verifyToken),
  resolver(userMiddlewares.validateUpdateParams),
  resolver(userControllers.updateUser)
);

users.put(
  "/user/:id",
  resolver(authMiddlewares.verifyToken),
  resolver(userMiddlewares.validateUpdateParams),
  resolver(userControllers.updateUser)
);

users.delete(
  "/user",
  resolver(authMiddlewares.verifyToken),
  resolver(userMiddlewares.validateDeleteId),
  resolver(userMiddlewares.validatePasswdDelete),
  resolver(userControllers.deleteUserbyQuery)
);

users.delete(
  "/users/:id",
  resolver(authMiddlewares.verifyToken),
  resolver(userMiddlewares.validateDeleteId),
  resolver(userControllers.deleteUserbyQuery)
);

users.delete(
  "/users",
  resolver(authMiddlewares.verifyToken),
  resolver(userMiddlewares.validateDeleteId),
  resolver(userControllers.deleteUserbyQuery)
);

export default users;
