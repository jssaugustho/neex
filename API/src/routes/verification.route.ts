import { Router } from "express";

// controle de acesso
import authMiddlewares from "../middlewares/auth.middlewares.js";

//controles da rota
import verificationMiddlewares from "../middlewares/verification.middlewares.js";
import verificationControllers from "../controllers/verification.controllers.js";
import authControllers from "../controllers/auth.controllers.js";

const verify = Router();

//verify email code
verify.get(
  "/verify-email",
  authMiddlewares.getFingerprint,
  authMiddlewares.verifyToken,
  verificationMiddlewares.CheckUserVerified,
  verificationMiddlewares.validateVerifyEmailParams,
  verificationMiddlewares.setEmailVerified,
  verificationControllers.response
);

// send email authentication
verify.get(
  "/resend",
  authMiddlewares.getFingerprint,
  authMiddlewares.verifyToken,
  verificationMiddlewares.verifyWaitTime,
  verificationMiddlewares.sendEmailVerification,
  verificationControllers.response
);

// //verify email code
// verify.get(
//   "/email-auth",
//   authMiddlewares.getFingerprint,
//   verificationMiddlewares.validateVerifyEmailParams,
//   verificationMiddlewares.verifyFingerprint,
//   verificationMiddlewares.setEmailVerified,
//   authControllers.authenticate
// );

// // send email authentication
// verify.post(
//   "/send-email-auth",
//   authMiddlewares.getFingerprint,
//   verificationMiddlewares.verifySendEmailAuthParams,
//   verificationMiddlewares.verifyWaitTime,
//   verificationMiddlewares.sendEmailVerification,
//   verificationControllers.response
// );

export default verify;
