import SwaggerJsDoc from "swagger-jsdoc";
import swaggerComponents from "./swaggerComponents.js";

const swaggerSpec = SwaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lux CRM Core API",
      version: "1.0.0",
      description: "Documentação das rotas da API para desenvolvimento.",
      contact: {
        name: "José Augustho Oliveira",
        email: "joseaugustholi@gmail.com",
      },
    },
    servers: [
      {
        url: process.env.API_URL,
      },
    ],
    components: swaggerComponents,
  },
  apis: ["./src/routes/*.ts"],
});

export default swaggerSpec;
