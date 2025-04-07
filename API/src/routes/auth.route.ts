import { Router } from "express";

//controle de acesso e autenticação
import authMiddlewares from "../middlewares/auth.middlewares.js";
import authControllers from "../controllers/auth.controllers.js";

const auth = Router();

//login
auth.post(
  "/login",
  authMiddlewares.getFingerprint,
  authMiddlewares.verifyLogin,
  authControllers.authenticate
);

//refresh token
auth.post(
  "/refresh",
  authMiddlewares.getFingerprint,
  authMiddlewares.verifyRefreshToken,
  authControllers.authenticate
);

//inativa a sessão repassada através da propriedade sessionId
auth.put(
  "/inactivate-session",
  authMiddlewares.getFingerprint,
  authMiddlewares.verifyToken,
  authMiddlewares.validateInactivateSession,
  authControllers.inactivateSession
);

//inativa a sessão logada.
auth.get(
  "/inactivate-session",
  authMiddlewares.getFingerprint,
  authMiddlewares.verifyToken,
  authControllers.inactivateSession
);

//inativa todas as sessões menos a que está logada
auth.get(
  "/inactivate-session/all",
  authMiddlewares.getFingerprint,
  authMiddlewares.verifyToken,
  authControllers.inactivateAllUserSessions
);

//inativa a sessão repassada através da propriedade sessionId
auth.put(
  "/block-session",
  authMiddlewares.getFingerprint,
  authMiddlewares.verifyToken,
  authMiddlewares.validateInactivateSession,
  authControllers.blockSession
);

export default auth;
