import swaggerJSDoc from "swagger-jsdoc";

import { getMessage } from "../../lib/getMessage.js";

const swaggerComponents: swaggerJSDoc.Components = {
  schemas: {
    User: {
      type: "object",
      properties: {
        id: { type: "string", example: "6813d062844330bfff6060cc" },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2025-05-01T19:49:54.929Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          example: "2025-05-01T19:49:54.929Z",
        },
        active: { type: "boolean", example: true },
        email: {
          type: "string",
          format: "email",
          example: "usuariodetestes@exemplo.com",
        },
        emailVerified: { type: "boolean", example: false },
        name: { type: "string", example: "Usuário" },
        lastName: { type: "string", example: "de Testes" },
        passwd: { type: "string", example: "********************************" },
        phone: { type: "string", example: "(11) 99173-8499" },
        authorizedSessionsId: {
          type: "array",
          items: { type: "string" },
          example: ["68139583dcb1be046325af45", "681921588016df0d14776710"],
        },
        role: {
          type: "string",
          enum: ["USER", "ADMIN", "SUPPORT"],
          example: "USER",
        },
      },
    },
    Login: {
      type: "object",
      properties: {
        email: {
          type: "string",
          example: "usuariodeteste@exemplo.com",
        },
        passwd: {
          type: "string",
          example: "SenhaDeTeste@123",
        },
      },
      required: ["email", "passwd"],
    },
    Refresh: {
      type: "object",
      properties: {
        refreshToken: {
          type: "string",
          example:
            "eyJhbGcoiiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MTkyMTU4ODAxNmRmMGQxNDc3NjcxMCIsInR5cGUiOiJSZWZyZXNoVG9rZW4iLCJpYXQiOjE3NDY1NTI0NDAsImV4cCI6MTkxOTM1MjQ0MH0.Areff-sczmycEA0N8Mrh7k5loycDozdKtRZqOx67fvk",
        },
        remember: {
          type: "boolean",
          example: true,
        },
      },
      required: ["refreshToken"],
    },
    Authenticate: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "Ok",
        },
        message: {
          type: "string",
          example: getMessage("successAuthentication"),
        },
        token: {
          type: "string",
          example:
            "Bearer eyJhbGciPiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MTkyMTU4ODAxNmRmMGQxNDc3NjcxMCIsInR5cGUiOiJUb2tlbiIsImlhdCI6MTc0NjU1MjQ0MCwiZXhwIjoxNzQ3MTUyNDQwfQ.4xZGnPU9twuwNyg8UvAHfeDFrkRscD6M3-KCEPwZkoi",
        },
        refreshToken: {
          type: "string",
          example:
            "eyJhbGcoiiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MTkyMTU4ODAxNmRmMGQxNDc3NjcxMCIsInR5cGUiOiJSZWZyZXNoVG9rZW4iLCJpYXQiOjE3NDY1NTI0NDAsImV4cCI6MTkxOTM1MjQ0MH0.Areff-sczmycEA0N8Mrh7k5loycDozdKtRZqOx67fvk",
        },
        session: {
          type: "string",
          example: "681921588016df0d14776766",
        },
        data: {
          $ref: "#/components/schemas/User",
        },
      },
    },
    PreAuthenticate: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "Ok",
        },
        message: {
          type: "string",
          example: getMessage("successAuthentication"),
        },
        token: {
          type: "string",
          example:
            "eyJhbGciPiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MTkyMTU4ODAxNmRmMGQxNDc3NjcxMCIsInR5cGUiOiJUb2tlbiIsImlhdCI6MTc0NjU1MjQ0MCwiZXhwIjoxNzQ3MTUyNDQwfQ.4xZGnPU9twuwNyg8UvAHfeDFrkRscD6M3-KCEPwZkoi",
        },
      },
    },
    Session: {
      type: "object",
      properties: {
        id: { type: "string", example: "682a7e87c731a9508f958954" },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2025-05-19T00:42:47.735Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          example: "2025-05-20T15:37:01.092Z",
        },
        lastActivity: {
          type: "string",
          format: "date-time",
          example: "2025-05-20T15:37:01.090Z",
        },
        ipId: { type: "string", example: "682a7e87c731a9508f958953" },
        fingerprint: { type: "string", example: "************************" },
        userAgent: {
          type: "string",
          example:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
        locale: { type: "string", example: "pt-BR" },
        timeZone: { type: "string", example: "America/Sao_Paulo" },
        name: { type: "string", example: "🖥️ Windows / Chrome" },
        token: {
          type: "string",
          example: "***************************************",
        },
        refreshToken: {
          type: "string",
          example: "***************************************",
        },
        exponencialEmailExpires: { type: "integer", example: -1 },
        userId: { type: "string", example: "6813d062844330bfff6060cc" },
        ip: {
          $ref: "#/components/schemas/Ip",
        },
      },
    },
    GetSession: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "Ok",
        },
        message: {
          type: "string",
          example: getMessage("sessionFound", "pt-BR", { count: 2 }),
        },
        data: {
          $ref: "#/components/schemas/Session",
        },
      },
    },
    Ip: {
      type: "object",
      properties: {
        id: { type: "string", example: "682a7e87c731a9508f958953" },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2025-05-19T00:42:47.318Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          example: "2025-05-20T15:37:30.463Z",
        },
        lastActivity: {
          type: "string",
          format: "date-time",
          example: "2025-05-19T00:42:47.318Z",
        },
        address: { type: "string", example: "187.94.56.100" },
        city: { type: "string", example: "São Paulo" },
        region: { type: "string", example: "SP" },
        country: { type: "string", example: "BR" },
        timeZone: { type: "string", example: "America/Sao_Paulo" },
        ll: {
          type: "array",
          items: { type: "number" },
          example: [-22.8305, -43.2192],
        },
        authorizedUsersId: {
          type: "array",
          items: { type: "string" },
          example: ["6813d062844330bfff6060cc"],
        },
      },
    },
    LogoutSession: {
      type: "object",
      properties: {
        status: { type: "string", example: "Ok" },
        message: {
          type: "string",
          example: getMessage("logoutSession", "pt-BR"),
        },
      },
    },
    BlockSession: {
      type: "object",
      properties: {
        status: { type: "string", example: "Ok" },
        message: {
          type: "string",
          example: getMessage("blockSession", "pt-BR"),
        },
      },
    },
    BlockSessions: {
      type: "object",
      properties: {
        status: { type: "string", example: "Ok" },
        message: {
          type: "string",
          example: getMessage("blockSessions", "pt-BR", {
            count: 2,
          }),
        },
        info: {
          type: "object",
          properties: {
            count: {
              type: "integer",
              example: 2,
            },
          },
        },
      },
    },
    UnauthorizeIp: {
      type: "object",
      properties: {
        status: { type: "string", example: "Ok" },
        message: {
          type: "string",
          example: getMessage("unauthorizedIp", "pt-BR"),
        },
      },
    },
    UnauthorizeIps: {
      type: "object",
      properties: {
        status: { type: "string", example: "Ok" },
        message: {
          type: "string",
          example: getMessage("unauthorizedIps", "pt-BR", {
            count: 2,
          }),
          info: {
            type: "object",
            properties: {
              count: {
                type: "integer",
                example: 2,
              },
            },
          },
        },
      },
    },
    SendEmail: {
      type: "object",
      properties: {
        email: {
          type: "string",
          example: "usuariodeteste@exemplo.com",
        },
      },
      required: ["email", "passwd"],
    },
    SendEmailToken: {
      type: "object",
      properties: {
        token: {
          type: "string",
          example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MzY4ZWY0ODYwMmQ5NTQzZTE1OTVlNSIsInR5cGUiOiJFbWFpbDJmYSIsImlhdCI6MTc0ODQxNTY3NywiZXhwIjoxNzQ4NzE1Njc3fQ.iVTatt1bWqAmJ88C7qCCMvrEfVUXUAh_1rYEPfnl0Sg",
        },
      },
      required: ["email", "passwd"],
    },
    PreAuthenticationRecoveryToken: {
      type: "object",
      properties: {
        token: {
          type: "string",
          example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MzY4ZWY0ODYwMmQ5NTQzZTE1OTVlNSIsInR5cGUiOiJFbWFpbDJmYSIsImlhdCI6MTc0ODQxNTY3NywiZXhwIjoxNzQ4NzE1Njc3fQ.iVTatt1bWqAmJ88C7qCCMvrEfVUXUAh_1rYEPfnl0Sg",
        },
        newPasswd: {
          type: "string",
          example: "***************",
        },
      },
      required: ["email", "passwd"],
    },
    PreAuthentication: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "Ok",
        },
        message: {
          type: "string",
          example: getMessage("emailVerified", "pt-BR"),
        },
      },
      required: ["email", "passwd"],
    },
    AuthenticationToken: {
      type: "object",
      properties: {
        token: {
          type: "string",
          example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MzY4ZWY0ODYwMmQ5NTQzZTE1OTVlNSIsInR5cGUiOiJFbWFpbDJmYSIsImlhdCI6MTc0ODQxNTY3NywiZXhwIjoxNzQ4NzE1Njc3fQ.iVTatt1bWqAmJ88C7qCCMvrEfVUXUAh_1rYEPfnl0Sg",
        },
        remember: {
          type: "boolean",
          example: true,
        },
      },
      required: ["email", "passwd"],
    },
    VerifySessionToken: {
      type: "object",
      properties: {
        token: {
          type: "string",
          example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MzY4ZWY0ODYwMmQ5NTQzZTE1OTVlNSIsInR5cGUiOiJFbWFpbDJmYSIsImlhdCI6MTc0ODQxNTY3NywiZXhwIjoxNzQ4NzE1Njc3fQ.iVTatt1bWqAmJ88C7qCCMvrEfVUXUAh_1rYEPfnl0Sg",
        },
      },
      required: ["email", "passwd"],
    },
    LogoutAllSessionToken: {
      type: "object",
      properties: {
        token: {
          type: "string",
          example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MzY4ZWY0ODYwMmQ5NTQzZTE1OTVlNSIsInR5cGUiOiJFbWFpbDJmYSIsImlhdCI6MTc0ODQxNTY3NywiZXhwIjoxNzQ4NzE1Njc3fQ.iVTatt1bWqAmJ88C7qCCMvrEfVUXUAh_1rYEPfnl0Sg",
        },
        logout: {
          type: "boolean",
          example: true,
        },
      },
      required: ["email", "passwd"],
    },
    SetNewPasswdToken: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "Ok",
        },
        message: {
          type: "string",
          example: getMessage("setNewPasswdToken", "pt-BR"),
        },
        token: {
          type: "string",
          example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MzY4ZWY0ODYwMmQ5NTQzZTE1OTVlNSIsInR5cGUiOiJFbWFpbDJmYSIsImlhdCI6MTc0ODQxNTY3NywiZXhwIjoxNzQ4NzE1Njc3fQ.iVTatt1bWqAmJ88C7qCCMvrEfVUXUAh_1rYEPfnl0Sg",
          required: true,
        },
      },
    },
    EmailVerified: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "Ok",
        },
        message: {
          type: "string",
          example: getMessage("emailVerified", "pt-BR"),
        },
      },
      required: ["status", "message"],
    },
    SendedEmail: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "Ok",
        },
        message: {
          type: "string",
          example: getMessage("sendedEmail", "pt-BR"),
        },
        info: {
          type: "object",
          properties: {
            timeLeft: {
              type: "integer",
              example: 60000,
              description:
                "Tempo restante (em milissegundos) até poder reenviar o e-mail.",
            },
            pretty: {
              type: "string",
              example: "1m 0s",
              description: "Tempo restante em formato legível.",
            },
          },
          required: ["timeLeft", "pretty"],
        },
      },
      required: ["status", "message", "info"],
    },
    LoginToken: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "Ok",
        },
        message: {
          type: "string",
          example: getMessage("sendedEmail", "pt-BR"),
        },
        token: {
          type: "string",
          example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MzdlNjlmM2NkMDY5ZDhmZDgxMzVkMCIsInR5cGUiOiJ2ZXJpZmljYXRpb24iLCJpYXQiOjE3NDg4MzQxMzUsImV4cCI6MTc0OTEzNDEzNX0.tuhh-ezkg7tyK6vDI-ey27iBGXd4bAuCY1Id2i58Wg8",
        },
      },
      required: ["status", "message", "info"],
    },
  },
  requestBodies: {
    Login: {
      description: "Login com email e senha.",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Login",
          },
        },
      },
    },
    RefreshToken: {
      description: "Gerando um novo token.",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Refresh",
          },
        },
      },
    },
    SendEmail: {
      description: "Enviar email..",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/SendEmail",
          },
        },
      },
    },
    SendEmailToken: {
      description: "Enviar token recebido no email.",
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              token: {
                type: "string",
                example:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MzY4ZWY0ODYwMmQ5NTQzZTE1OTVlNSIsInR5cGUiOiJFbWFpbDJmYSIsImlhdCI6MTc0ODQxNTY3NywiZXhwIjoxNzQ4NzE1Njc3fQ.iVTatt1bWqAmJ88C7qCCMvrEfVUXUAh_1rYEPfnl0Sg",
              },
            },
          },
        },
      },
    },
    PreAuthenticationRecoveryToken: {
      description: "Pré autenticação por token de email.",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/PreAuthenticationRecoveryToken",
          },
        },
      },
    },
    VerifySession: {
      description: "Verificação do token RECOVERY.",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/VerifySessionToken",
          },
        },
      },
    },
    SetNewPasswd: {
      description:
        "Verifica o token de SET_NEW_PASSWD, recebendo a nova senha e retornando o token de LOGOUT_ALL_SESSIONS",
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              token: {
                type: "string",
                example:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MzY4ZWY0ODYwMmQ5NTQzZTE1OTVlNSIsInR5cGUiOiJUb2tlbiIsImlhdCI6MTc0ODQ",
              },
              newPasswd: {
                type: "string",
                example: "*********************",
              },
            },
          },
        },
      },
    },
    LogoutAllSessions: {
      description: "Logout de todas as sessões.",
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              block: {
                type: "logout",
                example: "true",
              },
            },
          },
        },
      },
    },
    BlockAllSession: {
      description: "Logout de todas as sessões.",
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              token: {
                type: "string",
                example:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MzY4ZWY0ODYwMmQ5NTQzZTE1OTVlNSIsInR5cGUiOiJUb2tlbiIsImlhdCI6MTc0ODQ",
              },
            },
          },
        },
      },
    },
  },
  parameters: {
    BearerTokenHeader: {
      name: "Authorization",
      in: "header",
      description: "Token de autenticação.",
      required: true,
      schema: {
        type: "string",
        example:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTNkMDYyODQ0MzMwYmZmZjYwNjBjYyIsInNlc3Npb25JZCI6IjY4MzY4ZWY0ODYwMmQ5NTQzZTE1OTVlNSIsInR5cGUiOiJUb2tlbiIsImlhdCI6MTc0ODQ5MzExNSwiZXhwIjoxNzQ5MDkzMTE1fQ.A2_z3-rFKaPlpCoePOm2SWwLzOJsKTIyvPASplAL6E8",
      },
    },
    UserAgentHeader: {
      name: "User-Agent",
      in: "header",
      description: "User agent do cliente.",
      required: true,
      schema: {
        type: "string",
        example:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    },
    FingerprintIdHeader: {
      name: "Fingerprint",
      in: "header",
      description: "Fingerprint ID do cliente.",
      required: true,
      schema: {
        type: "string",
        example: "f6a3c2f1b4e243fd8e29",
      },
    },
    TimeZoneHeader: {
      name: "Timezone",
      in: "header",
      description: "Fuso horário do cliente.",
      required: true,
      schema: {
        type: "string",
        example: "America/Sao_Paulo",
      },
    },
    AcceptLanguageHeader: {
      name: "Accept-Language",
      in: "header",
      description: "Linguagem utilizada no cliente.",
      required: true,
      schema: {
        type: "string",
        example: "pt-BR",
      },
    },
    SessionIdHeader: {
      name: "Session",
      in: "header",
      description: "ID da sessão ativa armazenado no storage do navegador.",
      required: false,
      schema: {
        type: "string",
        example: "6813d062844330bfff6060c6",
      },
    },
    UserId: {
      name: "userId",
      in: "params",
      description: "ID do usuário.",
      required: true,
      schema: {
        type: "string",
        example: "6813d062844330bfff6060c6",
      },
    },
    SessionId: {
      name: "sessionId",
      in: "params",
      description: "ID da sessão.",
      required: true,
      schema: {
        type: "string",
        example: "6813d062844330bfff6060c6",
      },
    },
    IpId: {
      name: "ipId",
      in: "params",
      description: "ID do endereço IP cadastrado no banco de dados.",
      required: true,
      schema: {
        type: "string",
        example: "6813d062844330bfff6060c6",
      },
    },
    Take: {
      name: "take",
      in: "query",
      description: "Número máximo de usuários à retornar.",
      required: false,
      schema: {
        type: "number",
        example: 100,
      },
    },
    Skip: {
      name: "skip",
      in: "query",
      description: "Número de usuários à pular antes dos mostrados.",
      required: false,
      schema: {
        type: "number",
        example: 0,
      },
    },
  },
  responses: {
    UserError: {
      description: "Requisição incorreta.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", example: "UserError" },
              message: { type: "string", example: "Descrição do erro." },
            },
          },
        },
      },
    },
    AuthError: {
      description: "Não autorizado ou token inválido.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", example: "AuthError | TokenError" },
              message: { type: "string", example: "Descrição do erro." },
            },
          },
        },
      },
    },
    InternalServerError: {
      description: "Erro interno da API.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", example: "InternalServerError" },
              message: { type: "string", example: "Descrição do erro." },
            },
          },
        },
      },
    },
    PreAuthResponse: {
      description: "Pré-autenticado.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/PreAuthenticate",
          },
        },
      },
    },
    AuthResponse: {
      description: "Autenticado com sucesso.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Authenticate",
          },
        },
      },
    },
    Session: {
      description: "Buscando os dados da sessão atual.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/GetSession",
          },
        },
      },
    },
    Sessions: {
      description: "Buscando todas as sessões do usuário autenticado.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", example: "Ok" },
              message: {
                type: "string",
                example: getMessage("sessionsFound", "pt-BR", { count: 2 }),
              },
              info: {
                type: "object",
                properties: {
                  count: { type: "integer", example: 2 },
                  showing: { type: "integer", example: 100 },
                  skipped: { type: "integer", example: 0 },
                  activeSessions: { type: "integer", example: 2 },
                },
              },
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Session",
                },
              },
            },
          },
        },
      },
    },
    BlockSession: {
      description: "Sessão bloqueada com sucesso.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/BlockSession",
          },
        },
      },
    },
    LogoutSession: {
      description: "Logout realizado com sucesso.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/LogoutSession",
          },
        },
      },
    },
    BlockSessions: {
      description: "{{count}} sessões inativadas com sucesso.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/BlockSessions",
          },
        },
      },
    },
    UnauthorizeIp: {
      description: "Autorização revogada com sucesso.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UnauthorizeIp",
          },
        },
      },
    },
    UnauthorizeIps: {
      description: "Autorizações revogadas com sucesso.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UnauthorizeIps",
          },
        },
      },
    },
    EmailVerified: {
      description: "Email verificado com sucesso.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/EmailVerified",
          },
        },
      },
    },
    SendedEmail: {
      description: "Email enviado com sucesso.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/SendedEmail",
          },
        },
      },
    },
    VerifySessionResponse: {
      description: "Pré-autenticado.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/PreAuthentication",
          },
        },
      },
    },
    VerifyRecoveryResponse: {
      description: "Pré-autenticado.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                example: "Ok",
              },
              message: {
                type: "string",
                example: getMessage("tokenVerified", "pt-BR"),
              },
              data: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    example: "usuariodeteste@luxcrm.co",
                  },
                },
              },
            },
          },
        },
      },
    },
    SetNewPasswdResponse: {
      description: "Senha redefinida com sucesso.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                example: "Ok",
              },
              message: {
                type: "string",
                example: getMessage("changedPasswd", "pt-BR"),
              },
            },
          },
        },
      },
    },
    BlockAllSessionsResponse: {
      description: "Sessões bloqueadas com sucesso.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                example: "Ok",
              },
              message: {
                type: "string",
                example: getMessage("blockSessions", "pt-BR", {
                  count: 2,
                }),
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerComponents;
