import { Router } from "express";

//controle de acesso e autenticação
import verificationMiddlewares from "../middlewares/verification.middlewares.js";
import verificationControllers from "../controllers/verification.controllers.js";
import authMiddlewares from "../middlewares/auth.middlewares.js";
import authControllers from "../controllers/auth.controllers.js";
import userMiddlewares from "../middlewares/user.middlewares.js";

const verificationRoute = Router();

/** OK -  Enviar email de verificação de sessão com token "VERIFY_SESSION".
 *  @swagger
 *  /verification/send-verify-session-email:
 *    post:
 *      summary: Enviar email para autorizar um novo dispositivo com um token "VERIFY_SESSION".
 *      tags:
 *        - Verification
 *        - Security
 *      description: Envia um email com o token "VERIFY_SESSION".
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
  "/verification/send-verify-session-email",
  verificationMiddlewares.validateEmail,
  verificationMiddlewares.validateResend,
  verificationMiddlewares.sendVerifySessionEmail,
  verificationControllers.response,
);

/** OK - Verifica o token "VERIFY_SESSION" enviado no email
 *  @swagger
 *  /verification/verify-session:
 *    post:
 *      summary: Recebe um token "VERIFY_SESSION" e pré autentica enviando um token "AUTHENTICATION".
 *      tags:
 *        - Verification
 *        - Security
 *      description: Faz o login e autoriza um novo dissspositivo através do token enviado no email.
 *      requestBody:
 *        $ref: "#/components/requestBodies/VerifySession"
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/VerifyRecoveryResponse"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
verificationRoute.post(
  "/verification/verify-session",
  verificationMiddlewares.validateVerifySessionToken,
  verificationMiddlewares.setEmailVerified,
  authControllers.preAuthentication,
);

/** Enviar email de verificação para o usuário.
 *  @swagger
 *  /verification/send-verification-email:
 *    get:
 *      summary: Enviar um email de verificação para o usuário.
 *      tags:
 *        - Verification
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
  "/verification/send-verification-email",
  authMiddlewares.verifyToken,
  verificationMiddlewares.validateIfEmailAlreadyVerified,
  verificationMiddlewares.validateResend,
  verificationMiddlewares.sendVerificationEmail,
  verificationControllers.response,
);

/** Rota de verificação de email
 *  @swagger
 *  /verification/verify-email:
 *    post:
 *      summary: Verifique o seu email.
 *      tags:
 *        - Verification
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
  "/verification/verify-email",
  authMiddlewares.verifyToken,
  verificationMiddlewares.validateVerificationToken,
  verificationMiddlewares.setEmailVerified,
  verificationControllers.response,
);

/** Rota de login via email
 *  @swagger
 *  /verification/authenticate:
 *    post:
 *      summary: Recebe um token do tipo "AUTHENTICATION" e retorna um token do tipo "PRE_AUTHENTICATION".
 *      tags:
 *        - Verification
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
 *          $ref: "#/components/responses/PreAuthResponse"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
verificationRoute.post(
  "/verification/authenticate",
  verificationMiddlewares.validateAuthenticationToken,
  verificationMiddlewares.setEmailVerified,
  authControllers.preAuthentication,
);

/** OK - Envia email de redefinção de senha com um token "RECOVERY".
 *  @swagger
 *  /recovery/send-email:
 *    post:
 *      summary: Enviar email de recuperação de senha com um token "RECOVERY".
 *      tags:
 *        - Recovery
 *        - Security
 *      description: Envia um email com o link de redefinição de senha.
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
  "/recovery/send-email",
  verificationMiddlewares.validateEmail,
  verificationMiddlewares.validateResend,
  verificationMiddlewares.sendRecoveryEmail,
  verificationControllers.response,
);

/** OK - Rota de verificação do recoverytoken
 *  @swagger
 *  /recovery/verify:
 *    post:
 *      summary: Recebe um token do tipo "RECOVERY" e retorna um token "SET_NEW_PASSWD" via http cookies com nome "actionToken".
 *      tags:
 *        - Recovery
 *        - Security
 *      description: Verifica o token de "RECOVERY", faz parte do fluxo de redefinição de senha.
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
 *          $ref: "#/components/responses/VerifyRecoveryResponse"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
verificationRoute.post(
  "/recovery/verify",
  verificationMiddlewares.validateRecoveryToken,
  verificationMiddlewares.setEmailVerified,
  verificationControllers.verifyRecovery,
);

/** OK - Redefinir senha do usuário, recebe um token o tipo "SET_NEW_PASSWD" com a nova senha e retorna um token "LOGOUT_ALL_SESSIONS"
 *  @swagger
 *  /recovery/set-new-password:
 *    post:
 *      summary: Recebe um token do tipo "SET_NEW_PASSWD" e retorna um token do tipo "LOGOUT_ALL_SESSIONS" via http cookie, com nome de "actionToken".
 *      tags:
 *        - Recovery
 *        - Security
 *      description: Rota de alteração de senha, faz parte do fluxo de redefinição de senha sem autenticação.
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
 *          $ref: "#/components/responses/SetNewPasswdResponse"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
verificationRoute.post(
  "/recovery/set-new-password",
  verificationMiddlewares.validateSetNewPasswdToken,
  userMiddlewares.validateChangePasswd,
  verificationMiddlewares.changePasswd,
  verificationControllers.response,
);

/** Rota de verificação do recoverytoken
 *  @swagger
 *  /recovery/logout-all-sessions:
 *    post:
 *      summary: Recebe um token do tipo "LOGOUT_ALL_SESSIONS" retorna um token do tipo "PRE_AUTHENTICATION" via http cookie, com nome de "actionToken".
 *      tags:
 *        - Recovery
 *        - Security
 *      description: Se o parâmetro block for true ele faz o logout em todas as sessões do usuário menos a ativa, faz parte do fluxo de redefinição de senha.
 *      requestBody:
 *        $ref: "#/components/requestBodies/LogoutAllSessions"
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/BlockAllSessionsResponse"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
verificationRoute.post(
  "/recovery/logout-all-sessions",
  verificationMiddlewares.validateBlockAllSessionsToken,
  verificationMiddlewares.logoutAllSessions,
  authControllers.preAuthentication,
);

export default verificationRoute;
