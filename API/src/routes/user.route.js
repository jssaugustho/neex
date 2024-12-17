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

const users = Router();

//para tratamento de erros em funções async
function resolver(handlerFn) {
  return (req, res, next) => {
    return Promise.resolve(handlerFn(req, res, next)).catch((e) => next(e));
  };
}

//register a new user
users.post(
  "/user",
  resolver(userMiddlewares.validateStringParams),
  resolver(userMiddlewares.validateRegister),
  resolver(userControllers.createNewUser),
  resolver(verificationMiddlewares.generateVerificationCode),
  resolver(emailControllers.sendVerificationCode),
  resolver(authControllers.auth)
);

//update user
users.put(
  "/user",
  resolver(userMiddlewares.validateStringParams),
  resolver(authMiddlewares.accessControl),
  resolver(userMiddlewares.userPrivileges),
  resolver(userMiddlewares.validateUpdateParams),
  resolver(userControllers.updateUser)
);

//delete user
users.delete(
  "/user",
  resolver(userMiddlewares.validateStringParams),
  resolver(authMiddlewares.accessControl),
  resolver(userMiddlewares.validatePasswd),
  resolver(userControllers.deleteUser)
);

//get user data
users.get(
  "/user",
  resolver(authMiddlewares.accessControl),
  resolver(userControllers.getUserbyID)
);

export default users;
