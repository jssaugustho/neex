
import express, { Router } from "express";

//controle de acesso e autenticação
import authMiddlewares from "../middlewares/auth.middlewares.js";
import authControllers from "../controllers/auth.controllers.js";

// controles da rota
import userMiddlewares from "../middlewares/user.middlewares.js";
import userControllers from "../controllers/user.controllers.js";
import commonMiddlewares from "../middlewares/common.middlewares.js";


const users = Router();

//register
users.post(
  "/user/avatar/:userId",
  express.raw({type: ["image/jpeg","image/png"], limit: "5mb" }),
  authMiddlewares.verifyToken,
  userMiddlewares.validateAvatar,
  userMiddlewares.uploadAvatar,
  userControllers.response
);

export default users;
