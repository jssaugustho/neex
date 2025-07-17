import { Router } from "express";

//controle de acesso e autenticação
import authMiddlewares from "../middlewares/auth.middlewares.js";
import authControllers from "../controllers/auth.controllers.js";
import userMiddlewares from "../middlewares/user.middlewares.js";

const auth = Router();

/** Rota de login
 *  @swagger
 *  /login:
 *    post:
 *      summary: Fazer login.
 *      tags:
 *        - Authentication
 *      description: Faça seu login e receba de volta um token único de autenticação.
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
 *          $ref: "#/components/responses/PreAuthResponse"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
auth.post(
  "/login",
  authMiddlewares.verifyLogin,
  authControllers.preAuthentication,
);

/** Rota de login
 *  @swagger
 *  /authenticate:
 *    post:
 *      summary: Autenticar sessão.
 *      tags:
 *        - Authentication
 *      description: Faça seu login e receba de volta um token e um refresh token via httpCookie.
 *      requestBody:
 *        $ref: "#/components/requestBodies/SendEmailToken"
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
  "/authenticate",
  authMiddlewares.verifyAuthenticationToken,
  authControllers.authenticate,
);

/** Refresh Token
 *  @swagger
 *  /refresh:
 *    post:
 *      summary: Gerar novos tokens com o refresh token.
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
  authControllers.authenticate,
);

export default auth;
