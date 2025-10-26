import "express-async-errors";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// rotas
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import sessionRoute from "./routes/session.route.js";

import errorHandler from "./errors/errorHandler.js";
import sessionMiddlewares from "./middlewares/session.middlewares.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swaggerSpec.js";
import verificationRoute from "./routes/verification.route.js";
import Core from "./core/core.js";
import getEnvironment from "./lib/getEnvironment.js";

const { Logger } = Core;

class App {
  app = express();

  constructor() {
    getEnvironment(process.env);

    //fingerprint
    this.app.disable("x-powered-by");

    //usar json
    this.app.use(express.json());
    this.app.use(cookieParser());

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
          "Cookies",
        ],
        credentials: true,
      }),
    );

    if (process.env.NODE_ENV === "development") {
      Logger.info("Starting in development mode");
      Logger.info(
        `Documentation http://localhost:${process.env.API_PORT}/docs`,
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
    this.app.use("/core/", authRoute);
    this.app.use("/core/", sessionRoute);
    this.app.use("/core/", userRoute);
    this.app.use("/core/", verificationRoute);
  }
}

export default new App().app;
