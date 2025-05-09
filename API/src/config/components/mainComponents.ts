import { application } from "express";
import swaggerJSDoc from "swagger-jsdoc";

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
          example: "Autenticado com sucesso.",
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
    Session: {
      type: "object",
      properties: {
        id: { type: "string", example: "681921588016df0d14776789" },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2025-05-05T20:36:40.833Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          example: "2025-05-06T21:19:02.836Z",
        },
        lastActivity: {
          type: "string",
          format: "date-time",
          example: "2025-05-06T21:19:02.834Z",
        },
        ip: { type: "string", example: "181.222.238.8" },
        location: {
          type: "object",
          properties: {
            range: {
              type: "array",
              items: { type: "integer" },
              example: [3051282432, 3051290623],
            },
            country: { type: "string", example: "BR" },
            region: { type: "string", example: "MG" },
            eu: { type: "string", example: "0" },
            timezone: { type: "string", example: "America/Sao_Paulo" },
            city: { type: "string", example: "Uberlândia" },
            ll: {
              type: "array",
              items: { type: "number" },
              example: [-18.9203, -48.2782],
            },
            metro: { type: "integer", example: 0 },
            area: { type: "integer", example: 20 },
          },
        },
        fingerprint: { type: "string", example: "************************" },
        userAgent: {
          type: "string",
          example: "Mozilla/5.0 ... Chrome/124.0.0.0",
        },
        locale: { type: "string", example: "pt-BR" },
        timeZone: { type: "string", example: "America/Sao_Paulo" },
        name: { type: "string", example: "🖥️ Windows / Chrome" },
        attempts: {
          type: "object",
          description: "Tentativas de login por usuário usuário.",
          additionalProperties: {
            type: "object",
            properties: {
              attempts: { type: "integer", example: 0 },
              timeStamp: { type: "number", example: 1746566325901 },
            },
          },
          example: {
            "6813d062844330bfff6060cc": {
              attempts: 0,
              timeStamp: 1746566325901,
            },
          },
        },
        token: { type: "string", example: "********..." },
        refreshToken: { type: "string", example: "********..." },
        exponencialEmailExpires: { type: "integer", example: -1 },
        userId: { type: "string", example: "6813d062844330bfff60690c" },
        authorizedUsersId: {
          type: "array",
          items: { type: "string" },
          example: ["6813d062844330bfff6980cc"],
        },
      },
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
  },
  parameters: {
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
      required: true,
      schema: {
        type: "string",
        example: "6813d062844330bfff6060c6",
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
    AuthResponse: {
      description: "Login realizado com sucesso.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Authenticate",
          },
        },
      },
    },
    UniqueSession: {
      description: "Buscando os dados da sessão atual.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Session",
          },
        },
      },
    },
  },
};

export default swaggerComponents;
