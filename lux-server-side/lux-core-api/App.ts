import "express-async-errors";

import express from "express";
import cors from "cors";

// rotas
import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import sessionRoute from "./src/routes/session.route.js";

import errorHandler from "./src/errors/errorHandler.js";
import sessionMiddlewares from "./src/middlewares/session.middlewares.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swaggerSpec.js";
import verificationRoute from "./src/routes/verification.route.js";
import Core from "./src/core/core.js";

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
        origin: ["http://localhost:4000"],
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
      Logger.info(`Documentation http://localhost:${process.env.PORT}/docs`);
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
    this.app.use("/core/", authRoute);
    this.app.use("/core/", sessionRoute);
    this.app.use("/core/", userRoute);
    this.app.use("/core/", verificationRoute);
  }
}

export default new App().app;
