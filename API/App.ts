import "express-async-errors";

import express from "express";
import cors from "cors";

// rotas
import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";

import errorHandler from "./src/errors/errorHandler.js";
import authMiddlewares from "./src/middlewares/auth.middlewares.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };
import verificationRoute from "./src/routes/verification.route.js";

class App {
  app = express();

  constructor() {
    //fingerprint
    this.app.disable("x-powered-by");

    //usar json
    this.app.use(express.json());

    //bloqueio de user-agents da blacklist
    this.app.use(authMiddlewares.userAgentBlackList);

    if (process.env.NODE_ENV === "development") {
      console.log("Development mode detected");
      console.log("Documentation http://localhost:3000/docs");
      console.log("---------------------------------------------");
      this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    const corsOptions = {
      origin: [process.env.SPA_URL, process.env.API_URL],
      optionsSuccessStatus: 200,
    };

    this.app.use(cors(corsOptions));

    this.app.use(authMiddlewares.getSession);

    //chamar rotas
    this.routes();

    //tratamento de erros
    this.app.use(errorHandler);
  }

  routes() {
    //rotas
    this.app.use("/V1/", authRoute);
    this.app.use("/V1/", userRoute);
    this.app.use("/V1/", verificationRoute);
  }
}

export default new App().app;
