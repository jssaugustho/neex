import { application } from "express";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerComponents: swaggerJSDoc.Components = {
  schemas: {
    User: {
      type: "object",
      properties: {},
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
      name: "Locale",
      in: "header",
      description:
        "Fuso horário do cliente. (Por padrão é definido pelo endereço IP)",
      required: false,
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
    LoginResponse: {
      description: "Login realizado com sucesso.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", example: "Ok" },
              message: { type: "string", example: "Autenticado com sucesso." },
            },
          },
        },
      },
    },
  },
};

export default swaggerComponents;
