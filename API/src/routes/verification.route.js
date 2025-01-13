import { Router } from "express";

// controle de acesso
import authMiddlewares from "../middlewares/auth.middlewares.js";

//controles da rota
import verificationMiddlewares from "../middlewares/verification.middlewares.js";
import verificationControllers from "../controllers/verification.controllers.js";

//controles globais
import emailControllers from "../controllers/email.controllers.js";

const verify = Router();

//para tratamento de erros em funções async
function resolver(handlerFn) {
  return (req, res, next) => {
    return Promise.resolve(handlerFn(req, res, next)).catch((e) => next(e));
  };
}

//verify email code
verify.post(
  "/verify",
  resolver(verificationMiddlewares.validateStringParams),
  resolver(authMiddlewares.verifyToken),
  resolver(verificationMiddlewares.validateVerifyEmailCode),
  resolver(verificationControllers.setEmailVerified),
  resolver(emailControllers.sendEmailVerifiedNotification)
);

//resend email code
verify.get(
  "/resend",
  resolver(verificationMiddlewares.validateStringParams),
  resolver(authMiddlewares.verifyToken),
  resolver(verificationMiddlewares.validateResend),
  resolver(verificationMiddlewares.generateVerificationCode),
  resolver(emailControllers.sendVerificationCode),
  resolver(verificationControllers.sendVerificationEmailResponse)
);

export default verify;
