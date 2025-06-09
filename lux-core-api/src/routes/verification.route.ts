import { Router } from "express";

//controle de acesso e autenticação
import verificationMiddlewares from "../middlewares/verification.middlewares.js";
import verificationControllers from "../controllers/verification.controllers.js";
import authMiddlewares from "../middlewares/auth.middlewares.js";
import authControllers from "../controllers/auth.controllers.js";

const verificationRoute = Router();

/** Enviar email de autenticação para o usuário.
 *  @swagger
 *  /send-authentication-email:
 *    post:
 *      summary: Enviar email de autenticação.
 *      tags:
 *        - Authentication
 *        - Security
 *      description: Envia um email com o link de autenticação.
 *      requestBody:
 *        $ref: "#/components/requestBodies/SendEmail"
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          $ref: "#/components/responses/SendedEmail"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
verificationRoute.post(
  "/send-authentication-email",
  verificationMiddlewares.validateEmail,
  verificationMiddlewares.validateResend,
  verificationMiddlewares.sendAuthenticationEmail,
  verificationControllers.response
);

/** Enviar email de autenticação para o usuário.
 *  @swagger
 *  /send-recovery-email:
 *    post:
 *      summary: Enviar email de recuperação de senha.
 *      tags:
 *        - Authentication
 *        - Security
 *      description: Envia um email com o link de autenticação.
 *      requestBody:
 *        $ref: "#/components/requestBodies/SendEmail"
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          $ref: "#/components/responses/SendedEmail"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
verificationRoute.post(
  "/send-recovery-email",
  verificationMiddlewares.validateEmail,
  verificationMiddlewares.validateResend,
  verificationMiddlewares.sendRecoveryEmail,
  verificationControllers.response
);

/** Rota de login via email
 *  @swagger
 *  /email-authentication:
 *    post:
 *      summary: Login via link de autenticação no email.
 *      tags:
 *        - Authentication
 *        - Security
 *      description: Faça seu login via link de autenticação no email e receba de volta um token e um refresh token.
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
verificationRoute.post(
  "/email-authentication",
  verificationMiddlewares.validateAuthenticationToken,
  authControllers.authenticate
);

/** Enviar email de verificação para o usuário.
 *  @swagger
 *  /send-verification-email:
 *    get:
 *      summary: Enviar um email de verificação para o usuário.
 *      tags:
 *        - User
 *      description: Envia um email com o link de autenticação para o usuário fazer login.
 *      requestBody:
 *        $ref: "#/components/requestBodies/SendEmail"
 *      parameters:
 *        - $ref: "#/components/parameters/BearerTokenHeader"
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/SendedEmail"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
verificationRoute.get(
  "/send-verification-email",
  authMiddlewares.verifyToken,
  verificationMiddlewares.validateIfEmailAlreadyVerified,
  verificationMiddlewares.validateResend,
  verificationMiddlewares.sendVerificationEmail,
  verificationControllers.response
);

/** Rota de verificação de email
 *  @swagger
 *  /verify-email:
 *    post:
 *      summary: Verifique o seu email.
 *      tags:
 *        - User
 *      description: Verifique o seu email para ter acessoàs todas funções as funções da API.
 *      requestBody:
 *        $ref: "#/components/requestBodies/SendEmailToken"
 *      parameters:
 *        - $ref: "#/components/parameters/BearerTokenHeader"
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/EmailVerified"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
verificationRoute.post(
  "/verify-email",
  authMiddlewares.verifyToken,
  verificationMiddlewares.validateVerificationToken,
  verificationMiddlewares.setEmailVerified,
  verificationControllers.response
);

export default verificationRoute;
