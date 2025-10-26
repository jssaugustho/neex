import { config } from "dotenv";
import App from "./App.js";
import Core from "./core/core.js";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

process.env.TZ = "AMERICA/SAO_PAULO";
let port = process.env.API_PORT;

const { Logger } = Core;

if (!port) {
  Logger.error(`Port not found in environment.`);
  process.exit(1);
}

App.listen(port, () =>
  Logger.info(`Core API Listening http://localhost:${port}/`),
);
