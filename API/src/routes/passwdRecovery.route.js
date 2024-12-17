import { Router } from "express";

// controle de autenticação
import authControllers from "../controllers/auth.controllers.js";

//controles da rota
import recoveryMiddlewares from "../middlewares/passwdRecovery.middlewares.js";
import recoveryControllers from "../controllers/recoveryPasswd.controllers.js";

// controles globais
import emailControllers from "../controllers/email.controllers.js";

const recovery = Router();

//para tratamento de erros em funções async
function resolver(handlerFn) {
  return (req, res, next) => {
    return Promise.resolve(handlerFn(req, res, next)).catch((e) => next(e));
  };
}

//recovery passwd
recovery.post(
  "/recovery",
  resolver(recoveryMiddlewares.validateStringParams),
  resolver(recoveryMiddlewares.getUserbyEmail),
  resolver(recoveryMiddlewares.generateVerificationCode),
  resolver(recoveryControllers.setEmailVerified),
  resolver(emailControllers.sendPasswdRecoveryCode),
  resolver(recoveryControllers.recoveryPasswdResponse)
);

//verify recovery passwd code
recovery.post(
  "/verify-recovery-code",
  resolver(recoveryMiddlewares.validateStringParams),
  resolver(recoveryMiddlewares.getUserbyEmail),
  resolver(recoveryMiddlewares.validatePasswdRecoveryCode),
  resolver(emailControllers.sendPasswdRecoveryConfirmation),
  resolver(authControllers.auth)
);

export default recovery;
