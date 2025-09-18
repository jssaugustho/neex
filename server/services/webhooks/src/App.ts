import dotenv from "dotenv";
import "express-async-errors";

import express from "express";
import cors from "cors";

import errorHandler from "./errors/errorHandler.js";

import Core from "./core/core.js";
import webhooks from "./routes/webhooks.route.js";

dotenv.config();

const { Logger } = Core;

class App {
  app = express();

  constructor() {
    //fingerprint
    this.app.disable("x-powered-by");

    this.app.use("/webhooks", webhooks);

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

    this.app.use((req, res, next) => {
      res.status(404).json({
        status: "NotFoundError",
        message: "Route not found",
      });
    });

    //tratamento de erros
    this.app.use(errorHandler);
  }
}

export default new App().app;
