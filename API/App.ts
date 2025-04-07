import "express-async-errors";

import express from "express";
import cors from "cors";

// rotas
import userRoute from "./src/routes/user.route.js";

import verificationRoute from "./src/routes/verification.route.js";
import authRoute from "./src/routes/auth.route.js";
import quizRoute from "./src/routes/quiz.route.js";

import errors from "./src/errors/errors.js";
import errorHandler from "./src/errors/errorHandler.js";
import authMiddlewares from "./src/middlewares/auth.middlewares.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };

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

    //chamar rotas
    this.routes();

    //tratamento de erros
    this.app.use(errorHandler);
  }

  routes() {
    const corsOptions = {
      origin: [process.env.API_URL],
      optionsSuccessStatus: 200,
    };

    this.app.use(cors(corsOptions));

    //rotas
    this.app.use(userRoute);
    this.app.use(verificationRoute);
    this.app.use(authRoute);
    this.app.use(quizRoute);
  }
}

export default new App().app;
