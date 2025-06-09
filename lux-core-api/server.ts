import App from "./App.js";
import Core from "./src/core/core.js";

process.env.TZ = "AMERICA/SAO_PAULO";
let port = process.env.PORT || 3000;

const { Logger } = Core;

App.listen(port, () => Logger.info(`API Listening http://localhost:${port}/`));

//   .createServer(
//     {
//       cert: fs.readFileSync("./cert/code.crt"),
//       key: fs.readFileSync("./cert/code.key"),
//     },
//     App
//   )
//   .listen(3001, console.log("Listening https://localhost:3001"));
//
