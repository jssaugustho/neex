import "express-async-errors";

import express from "express";
import cors from "cors";

import errorHandler from "./src/errors/errorHandler.js";
import sessionMiddlewares from "./src/middlewares/session.middlewares.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swaggerSpec.js";

import Core from "./src/core/core.js";

import userRoute from "./src/routes/user.route.js";

const { Logger } = Core;

class App {
  app = express();

  constructor() {
    //fingerprint
    this.app.disable("x-powered-by");

    //usar json
    this.app.use(express.json());

    this.app.use(
      cors({
        origin: ["http://localhost:3001"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "Accept-Language",
          "x-Timezone",
          "User-Agent",
          "Session",
          "Fingerprint",
        ],
      }),
    );

    if (process.env.NODE_ENV === "development") {
      Logger.info("Starting in development mode");
      Logger.info(
        `Documentation http://localhost:${process.env.UPLOAD_API_PORT}/docs`,
      );
      this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    //identificador de sessão
    this.app.use(sessionMiddlewares.getSession);

    //bloqueio de user-agents da blacklist
    this.app.use(sessionMiddlewares.userAgentBlackList);

    //chamar rotas
    this.routes();

    //tratamento de erros
    this.app.use(errorHandler);
  }

  routes() {
    //rotas V1
    this.app.use("/upload/", userRoute);
  }
}

export default new App().app;
