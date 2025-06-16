import App from "./App.js";
import Core from "./src/core/core.js";

process.env.TZ = "AMERICA/SAO_PAULO";
let port = process.env.CORE_API_PORT;

const { Logger } = Core;

if (!port) {
    Logger.error(`Port not found in environment.`);
    process.exit(1)
} 

App.listen(port, () => Logger.info(`Core API Listening http://localhost:${port}/`));
