import { Router } from "express";

//controle de acesso e autenticação
import authMiddlewares from "../middlewares/auth.middlewares.js";
import authControllers from "../controllers/auth.controllers.js";
import commonMiddlewares from "../middlewares/common.middlewares.js";

const auth = Router();

/** Rota de login
 *  @swagger
 *  /login:
 *    post:
 *      summary: Fazer login.
 *      tags:
 *        - Authentication
 *      description: Faça seu login e receba de volta um token e um refresh token.
 *      requestBody:
 *        $ref: "#/components/requestBodies/Login"
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/AuthResponse"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */

auth.post("/login", authMiddlewares.verifyLogin, authControllers.authenticate);

/** Refresh Token
 *  @swagger
 *  /refresh:
 *    post:
 *      summary: Gerar novo token com o refresh token.
 *      tags:
 *        - Authentication
 *      description: Envie um refresh token válido e receba de volta um token e um refresh token.
 *      requestBody:
 *        $ref: "#/components/requestBodies/RefreshToken"
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/AuthResponse"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */

auth.post(
  "/refresh",
  authMiddlewares.verifyRefreshToken,
  authControllers.authenticate
);

/** get atual session
 *  @swagger
 *  /session:
 *    get:
 *      summary: Retorna os dados da sessão atual.
 *      tags:
 *        - Sessions
 *      description: Retorna os dados da sessão atual.
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/UniqueSession"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */

auth.get(
  "/session",
  authMiddlewares.verifyToken,
  authMiddlewares.getAtualSession,
  authControllers.responseRequests
);

//inativa a sessão logada
auth.get(
  "/session/logout/",
  authMiddlewares.verifyToken,
  authControllers.inactivateSession
);

auth.get(
  "/session/logout/:sessionId",
  authMiddlewares.verifyToken,
  authMiddlewares.validateSessionId,
  authControllers.inactivateSession
);

auth.get(
  "/session/unauthorize",
  authMiddlewares.verifyToken,
  authControllers.blockSession
);

auth.get(
  "/session/unauthorize/:sessionId",
  authMiddlewares.verifyToken,
  authMiddlewares.validateSessionId,
  authControllers.blockSession
);

auth.get(
  "/sessions",
  authMiddlewares.verifyToken,
  commonMiddlewares.validateSteps,
  authMiddlewares.getSessions,
  authControllers.responseRequests
);

auth.get(
  "/sessions/count",
  authMiddlewares.verifyToken,
  authMiddlewares.countSessions,
  authControllers.responseRequests
);

auth.get(
  "/sessions/logout",
  authMiddlewares.verifyToken,
  authControllers.inactivateAllUserSessions
);

auth.get(
  "/sessions/unauthorize/",
  authMiddlewares.verifyToken,
  authControllers.blockAllUserSessions
);

auth.get(
  "/support/sessions/:userId",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  authMiddlewares.validateUserId,
  commonMiddlewares.validateSteps,
  authMiddlewares.getSessions,
  authControllers.responseRequests
);

auth.get(
  "/support/sessions/count/:userId",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  authMiddlewares.validateUserId,
  authMiddlewares.countSessions,
  authControllers.responseRequests
);

auth.get(
  "/support/sessions/logout/:userId",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  authMiddlewares.validateUserId,
  authControllers.inactivateAllUserSessions
);

auth.get(
  "/support/sessions/unauthorize/:userId/",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  authMiddlewares.validateUserId,
  authControllers.blockAllUserSessions
);

auth.get(
  "/support/session/logout/:sessionId",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  authMiddlewares.validateSessionId,
  authControllers.inactivateSession
);

auth.get(
  "/support/session/unauthorize/:userId/:sessionId",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  authMiddlewares.validateUserId,
  authMiddlewares.validateSessionId,
  authControllers.blockSession
);

export default auth;
