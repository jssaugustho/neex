import { NextFunction, Response, Router } from "express";

//controle de acesso e autenticação
import authMiddlewares from "../middlewares/auth.middlewares.js";
import authControllers from "../controllers/auth.controllers.js";

// controles da rota
import userMiddlewares from "../middlewares/user.middlewares.js";
import RequestUserPayload from "../@types/RequestUserPayload/RequestUserPayload.js";

const auth = Router();

//login
auth.post(
  "/login",
  userMiddlewares.validateStringParams,
  authMiddlewares.verifyLogin,
  authMiddlewares.getUserData,
  authControllers.auth
);

//refresh token
auth.post(
  "/refresh",
  userMiddlewares.validateStringParams,
  authMiddlewares.verifyRefreshToken,
  authMiddlewares.getUserData,
  authControllers.auth
);

auth.get(
  "/invalidate-session",
  authMiddlewares.verifyToken,
  authMiddlewares.getUserData,
  authMiddlewares.validateDeleteSession,
  authControllers.deAuth
);

auth.get(
  "/invalidate-all-sessions",
  authMiddlewares.verifyToken,
  authMiddlewares.getUserData,
  authControllers.deAuthAll
);

export default auth;
