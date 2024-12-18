import express from "express";

// rotas
import userRoute from "./src/routes/user.route.js";
import leadRoute from "./src/routes/lead.route.js";
import verificationRoute from "./src/routes/verification.route.js";
import authRoute from "./src/routes/auth.route.js";
import recoveryRoute from "./src/routes/passwdRecovery.route.js";

class App {
  constructor() {
    //iniciar express
    this.app = express();

    //fingerprint
    this.app.disable("x-powered-by");

    //usar json
    this.app.use(express.json());

    //chamar rotas
    this.routes();
  }
  routes() {
    //rotas
    this.app.use(userRoute);
    this.app.use(leadRoute);
    this.app.use(verificationRoute);
    this.app.use(authRoute);
    this.app.use(recoveryRoute);

    //tratamento de erros
    // this.app.use(errors.response);
  }
}

export default new App().app;
