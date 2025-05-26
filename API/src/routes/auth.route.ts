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
  authControllers.authenticate
);

/** Get atual session
 *  @swagger
 *  /session:
 *    get:
 *      summary: Retorna os dados da sessão atual.
 *      tags:
 *        - Security
 *      description: Retorna os dados da sessão atual.
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/Session"
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

/** Logout Button
 *  @swagger
 *  /session/logout/{sessionId}:
 *    get:
 *      summary: Botão de logout simples.
 *      tags:
 *        - Security
 *      description: Faz o logout da sessão atual, invalidando os tokens e desvinculando-a do usuário.
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/LogoutSession"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
auth.get(
  "/session/logout/:sessionId",
  authMiddlewares.verifyToken,
  authMiddlewares.validateSessionId,
  authControllers.logoutSession
);

/** block session button - remove 2fa e faz logout
 *  @swagger
 *  /session/block/{sessionId}:
 *    get:
 *      summary: Botão de logout seguro.
 *      tags:
 *        - Security
 *      description: |
 *        Faz o logout da sessão, exigindo autenticação de dois fatores para logar novamente.
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/BlockSession"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
auth.get(
  "/session/block/:sessionId",
  authMiddlewares.verifyToken,
  authMiddlewares.validateSessionId,
  authControllers.blockSession
);

/** dont remember autorization.
 *  @swagger
 *  /ip/unauthorize/{ipId}:
 *    get:
 *      summary: Botão de remover 2fa do ip para o usuário atual.
 *      tags:
 *        - Security
 *      description: |
 *        Remove a autorização do IP repassado pelo parâmetro ipId, fazendo com que necessite realizar a autenticação de dois fatores novamente e faz o logout de todas as sessões vinculadas.
 *        Usado no botão de logout quando o usuário opta por não confiar nesse dispositivo.
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/UnauthorizeIp"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
auth.get(
  "/ip/unauthorize/:ipId",
  authMiddlewares.verifyToken,
  authMiddlewares.validateIpId,
  authControllers.unauthorizeIp
);

/** get user sessions
 *  @swagger
 *  /sessions:
 *    get:
 *      summary: Retorna todas as sessões vinculadas ao usuário autenticado.
 *      tags:
 *        - Security
 *      description: Retorna todas as sessões vinculadas ao usuário autenticado.
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/Sessions"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
auth.get(
  "/sessions",
  authMiddlewares.verifyToken,
  commonMiddlewares.validateSteps,
  authMiddlewares.getSessions,
  authControllers.responseRequests
);

/** account securtiy button - faz o logout e remove a 2fa de todas as sessões menos a atual.
 *  @swagger
 *  /ips/unauthorize:
 *    get:
 *      summary: Botão de segurança / logout em todas as sessões.
 *      tags:
 *        - Security
 *      description: Remove a autorização dos IPs vinculados ao usuário atual, fazendo com que necessite realizar a autenticação de dois fatores novamente e faz o logout de todas as sessões vinculadas.
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/UnauthorizeIps"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
auth.get(
  "/ips/unauthorize/",
  authMiddlewares.verifyToken,
  authControllers.unauthorizeIps
);

/** get user sessions
 *  @swagger
 *  /support/sessions/{userId}:
 *    get:
 *      summary: Retorna todas as sessões vinculadas ao usuário referenciado pelo parâmetro userId.
 *      tags:
 *        - Security
 *        - Support
 *      description: Retorna todas as sessões vinculadas ao usuário referenciado pelo parâmetro userId.
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/Sessions"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
auth.get(
  "/support/sessions/:userId",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  authMiddlewares.validateUserId,
  commonMiddlewares.validateSteps,
  authMiddlewares.getSessions,
  authControllers.responseRequests
);

/** unauthorize all ips
 *  @swagger
 *  /support/ips/unauthorize/{userId}:
 *    get:
 *      summary: Botão de segurança do suporte ao usuário.
 *      tags:
 *        - Security
 *        - Support
 *      description: |
 *        Remove a autorização dos IPs vinculados ao usuário referenciado pelo parâmetro userId, fazendo com que necessite realizar a autenticação de dois fatores novamente e faz o logout de todas as sessões vinculadas.
 *        Essa rota é usada no Botão de segurança do usuário e ao realizar a recuperação de senha.
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/UnauthorizeIps"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
auth.get(
  "/support/ips/unauthorize/:userId",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  authMiddlewares.validateUserId,
  authControllers.unauthorizeIps
);

/** Logout Button
 *  @swagger
 *  /support/session/logout/{sessionId}:
 *    get:
 *      summary: Botão de logout simples via suporte do usuário.
 *      tags:
 *        - Security
 *        - Support
 *      description: Faz o logout da sessão atual, invalidando os tokens e desvinculando-a do usuário.
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/LogoutSession"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
auth.get(
  "/support/session/logout/:sessionId",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  authMiddlewares.validateSessionId,
  authControllers.logoutSession
);

/** unauthorize ip by id
 *  @swagger
 *  /support/ip/unauthorize/{userId}/ipId}:
 *    get:
 *      summary: Botão de remover a 2fa do ip via suporte do usuário.
 *      tags:
 *        - Security
 *        - Support
 *      description: |
 *        Remove a autorização dos IP referenciado pelo parâmetro ipId, fazendo com que necessite realizar a autenticação de dois fatores novamente e faz o logout de todas as sessões vinculadas.
 *        Essa rota será usada para que o suporte possa remover a autorização de um ip não reconhecido pelo usuário.
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/UnauthorizeIp"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
auth.get(
  "/support/ip/unauthorize/:userId/:ipId",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  authMiddlewares.validateUserId,
  authMiddlewares.validateIpId,
  authControllers.unauthorizeIp
);

/** block session
 *  @swagger
 *  /support/session/block/{userId}/{sessionId}:
 *    get:
 *      summary: Botão de logout seguro via suporte do usuário.
 *      tags:
 *        - Security
 *        - Support
 *      description: Remove a autorização do usuário referenciado pelo parâmetro userId na sessão repassada pelo sessionId.
 *      parameters:
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *      responses:
 *        200:
 *          $ref: "#/components/responses/BlockSession"
 *        400:
 *          $ref: "#/components/responses/UserError"
 *        401:
 *          $ref: "#/components/responses/AuthError"
 *        502:
 *          $ref: "#/components/responses/InternalServerError"
 */
auth.get(
  "/support/session/block/:userId/:sessionId",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  authMiddlewares.validateUserId,
  authMiddlewares.validateSessionId,
  authControllers.blockSession
);

export default auth;
