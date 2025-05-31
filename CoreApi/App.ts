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

class App {
  app = express();

  constructor() {
    //fingerprint
    this.app.disable("x-powered-by");

    //usar json
    this.app.use(express.json());

    if (process.env.NODE_ENV === "development") {
      console.log("Development mode detected");
      console.log("Documentation http://localhost:3000/docs");
      console.log("---------------------------------------------");
      this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    const corsOptions = {
      origin: [process.env.SPA_URL, process.env.API_URL],
      optionsSuccessStatus: 200,
    };

    this.app.use(cors(corsOptions));

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
    this.app.use("/V1/", authRoute);
    this.app.use("/V1/", sessionRoute);
    this.app.use("/V1/", userRoute);
    this.app.use("/V1/", verificationRoute);
  }
}

export default new App().app;
