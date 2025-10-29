import dotenv from "dotenv";
import App from "./App.js";
import Core from "./core/core.js";

dotenv.config();

process.env.TZ = "AMERICA/SAO_PAULO";
let port = process.env.WEBHOOKS_PORT;

const { Logger } = Core;

if (!port) {
  Logger.error(`Port not found in environment.`);
  process.exit(1);
}

App.listen(port, () =>
  Logger.info(`Webhooks Listening http://localhost:${port}/`),
);
