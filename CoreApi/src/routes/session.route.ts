import { Router } from "express";

//controle de acesso e autenticação
import authMiddlewares from "../middlewares/auth.middlewares.js";
import commonMiddlewares from "../middlewares/common.middlewares.js";
import sessionMiddlewares from "../middlewares/session.middlewares.js";
import sessionControllers from "../controllers/session.controllers.js";

const session = Router();

/** Get atual session
 *  @swagger
 *  /session:
 *    get:
 *      summary: Retorna os dados da sessão atual.
 *      tags:
 *        - Security
 *      description: Retorna os dados da sessão atual.
 *      parameters:
 *        - $ref: "#/components/parameters/BearerTokenHeader"
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
session.get(
  "/session",
  authMiddlewares.verifyToken,
  sessionMiddlewares.getAtualSession,
  sessionControllers.responseRequests
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
 *        - $ref: "#/components/parameters/BearerTokenHeader"
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *        - $ref: "#/components/parameters/SessionId"
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
session.get(
  "/session/logout/:sessionId",
  authMiddlewares.verifyToken,
  sessionMiddlewares.validateSessionId,
  sessionControllers.logoutSession
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
 *        - $ref: "#/components/parameters/BearerTokenHeader"
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *        - $ref: "#/components/parameters/SessionId"
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
session.get(
  "/session/block/:sessionId",
  authMiddlewares.verifyToken,
  sessionMiddlewares.validateSessionId,
  sessionControllers.blockSession
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
 *        - $ref: "#/components/parameters/BearerTokenHeader"
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *        - $ref: "#/components/parameters/IpId"
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
session.get(
  "/ip/unauthorize/:ipId",
  authMiddlewares.verifyToken,
  sessionMiddlewares.validateIpId,
  sessionControllers.unauthorizeIp
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
 *        - $ref: "#/components/parameters/Take"
 *        - $ref: "#/components/parameters/Skip"
 *        - $ref: "#/components/parameters/BearerTokenHeader"
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
session.get(
  "/sessions",
  authMiddlewares.verifyToken,
  commonMiddlewares.validateSteps,
  sessionMiddlewares.getSessions,
  sessionControllers.responseRequests
);

/** get user sessions
 *  @swagger
 *  /sessions/{userId}:
 *    get:
 *      summary: Retorna todas as sessões vinculadas ao usuário repassado pelo Id.
 *      tags:
 *        - Security
 *      description: Retorna todas as sessões vinculadas ao usuário repassado pelo Id.
 *      parameters:
 *        - $ref: "#/components/parameters/Take"
 *        - $ref: "#/components/parameters/Skip"
 *        - $ref: "#/components/parameters/BearerTokenHeader"
 *        - $ref: "#/components/parameters/FingerprintIdHeader"
 *        - $ref: "#/components/parameters/TimeZoneHeader"
 *        - $ref: "#/components/parameters/UserAgentHeader"
 *        - $ref: "#/components/parameters/AcceptLanguageHeader"
 *        - $ref: "#/components/parameters/SessionIdHeader"
 *        - $ref: "#/components/parameters/UserId"
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
session.get(
  "/sessions/:userId",
  authMiddlewares.verifyToken,
  sessionMiddlewares.validateUserId,
  commonMiddlewares.validateSteps,
  sessionMiddlewares.getSessions,
  sessionControllers.responseRequests
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
 *        - $ref: "#/components/parameters/BearerTokenHeader"
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
session.get(
  "/ips/unauthorize/",
  authMiddlewares.verifyToken,
  sessionControllers.unauthorizeIps
);

/** account securtiy button - faz o logout e remove a 2fa de todas as sessões menos a atual.
 *  @swagger
 *  /ips/unauthorize/{userId}:
 *    get:
 *      summary: Botão de segurança / logout em todas as sessões.
 *      tags:
 *        - Security
 *      description: Remove a autorização dos IPs vinculados ao usuário repassado pelo Id, fazendo com que necessite realizar a autenticação de dois fatores novamente e faz o logout de todas as sessões vinculadas.
 *      parameters:
 *        - $ref: "#/components/parameters/BearerTokenHeader"
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
session.get(
  "/ips/unauthorize/:userId",
  authMiddlewares.verifyToken,
  sessionMiddlewares.validateUserId,
  sessionControllers.unauthorizeIps
);

export default session;
