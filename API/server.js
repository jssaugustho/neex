import App from "./App.js";

process.env.TZ = "AMERICA/SAO_PAULO";

App.listen(3000, console.log("Listening http://localhost:3000/"));

//   .createServer(
//     {
//       cert: fs.readFileSync("./cert/code.crt"),
//       key: fs.readFileSync("./cert/code.key"),
//     },
//     App
//   )
//   .listen(3001, console.log("Listening https://localhost:3001"));
