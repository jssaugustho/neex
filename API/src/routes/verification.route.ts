import { Router } from "express";

//controle de acesso e autenticação
import verificationMiddlewares from "../middlewares/verification.middlewares.js";
import verificationControllers from "../controllers/verification.controllers.js";
import authMiddlewares from "../middlewares/auth.middlewares.js";
import authControllers from "../controllers/auth.controllers.js";

const verificationRoute = Router();

//refresh token
verificationRoute.post(
  "/resend",
  verificationMiddlewares.validateResend,
  verificationMiddlewares.sendEmail,
  verificationControllers.response
);

//retorna todas as sessões ativas
verificationRoute.post(
  "/2fa",
  verificationMiddlewares.validateEmailToken,
  authControllers.authenticate
);

export default verificationRoute;
