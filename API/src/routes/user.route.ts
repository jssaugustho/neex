import { Router } from "express";

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
  "/user",
  userMiddlewares.validateRegisterParams,
  userMiddlewares.registerNewUser,
  userControllers.response
);

//email exists
users.post(
  "/email-exists",
  userMiddlewares.emailExists,
  userControllers.response
);

//get logged user
users.get(
  "/user",
  authMiddlewares.verifyToken,
  userMiddlewares.getUser,
  userControllers.response
);

//get one user (only ADMIN || SUPPORT)
users.get(
  "/user/:id",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  userMiddlewares.validateUserId,
  userMiddlewares.getUser,
  userControllers.response
);

//get all users (only ADMIN || SUPPORT)
users.get(
  "/support/users",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  userMiddlewares.validateSearch,
  commonMiddlewares.validateSteps,
  userMiddlewares.getUsers,
  userControllers.response
);

//get all users count (only ADMIN || SUPPORT)
users.get(
  "/support/users/count",
  authMiddlewares.verifyToken,
  commonMiddlewares.verifyAdminAndSupport,
  userMiddlewares.validateSearch,
  userMiddlewares.countAllUsers,
  userControllers.response
);

//patch user
users.patch(
  "/user",
  authMiddlewares.verifyToken,
  userMiddlewares.validateUpdateParams,
  userMiddlewares.ownUserQuery,
  userMiddlewares.updateUsers,
  userControllers.response
);

//patch user (only ADMIN || SUPPORT)
users.patch(
  "/user/:query",
  authMiddlewares.verifyToken,
  userMiddlewares.validateUpdateParams,0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
  userMiddlewares.validateUpdateQuery,
  userMiddlewares.updateUsers,
  userControllers.response
);

export default users;
