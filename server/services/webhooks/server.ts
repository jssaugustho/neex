import dotenv from "dotenv";
import App from "./src/App.js";
import Core from "./src/core/core.js";

dotenv.config();

process.env.TZ = "AMERICA/SAO_PAULO";
let port = process.env.CORE_API_PORT;

const { Logger } = Core;

if (!port) {
  Logger.error(`Port not found in environment.`);
  process.exit(1);
}

App.listen(port, () =>
  Logger.info(`Webhooks Listening http://localhost:${port}/`),
);
