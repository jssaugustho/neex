import { Router } from "express";

//controle de acesso e autenticação
import authMiddlewares from "../middlewares/auth.middlewares.js";
import authControllers from "../controllers/auth.controllers.js";

// controles da rota
import userMiddlewares from "../middlewares/user.middlewares.js";
import userControllers from "../controllers/user.controllers.js";

// controle globais
import emailControllers from "../controllers/email.controllers.js";

//só para gerar o código de verificação
import verificationMiddlewares from "../middlewares/verification.middlewares.js";

const users = Router();

//register
users.post(
  "/user",
  authMiddlewares.getFingerprint,
  userMiddlewares.validateRegisterParams,
  userMiddlewares.registerNewUser,
  authControllers.authenticate
);

//email exists
users.post(
  "/email-exists",
  authMiddlewares.getFingerprint,
  userMiddlewares.emailExists,
  userControllers.response
);

//get logged user
users.get(
  "/user",
  authMiddlewares.getFingerprint,
  authMiddlewares.verifyToken,
  userMiddlewares.getUser,
  userControllers.response
);

//get all users (only ADMIN)
users.get(
  "/users/all",
  authMiddlewares.getFingerprint,
  authMiddlewares.verifyToken,
  userMiddlewares.verifyAdmin,
  userMiddlewares.getAllUsers,
  userControllers.response
);

//get all users count (only ADMIN)
users.get(
  "/users/all/count",
  authMiddlewares.getFingerprint,
  authMiddlewares.verifyToken,
  userMiddlewares.verifyAdmin,
  userMiddlewares.countAllUsers,
  userControllers.response
);

users.put(
  "/user",
  authMiddlewares.getFingerprint,
  authMiddlewares.verifyToken,
  userMiddlewares.verifyAdmin,
  userMiddlewares.validateUpdateParams,
  userMiddlewares.validateUpdateQuery,
  userMiddlewares.updateUser,
  userControllers.response
);

// users.get(
//   "/user",
//   authMiddlewares.verifyToken,
//   userMiddlewares.validateId,
//   userControllers.getUserbyQuery
// );

// users.get(
//   "/users",
//   authMiddlewares.verifyToken,
//   userMiddlewares.validateId,
//   userMiddlewares.validateSortBy,
//   userControllers.getUserbyQuery
// );

// users.get(
//   "/users/:id",
//   authMiddlewares.verifyToken,
//   userMiddlewares.validateId,
//   userControllers.getUserbyQuery
// );

// users.put(
//   "/user",
//   authMiddlewares.verifyToken,
//   userMiddlewares.validateUpdateParams,
//   userControllers.updateUser
// );

// users.put(
//   "/user/:id",
//   authMiddlewares.verifyToken,
//   userMiddlewares.validateUpdateParams,
//   userControllers.updateUser
// );

// users.delete(
//   "/user",
//   authMiddlewares.verifyToken,
//   userMiddlewares.validateDeleteId,
//   userMiddlewares.validatePasswdDelete,
//   userControllers.deleteUserbyQuery
// );

// users.delete(
//   "/users/:id",
//   authMiddlewares.verifyToken,
//   userMiddlewares.validateDeleteId,
//   userControllers.deleteUserbyQuery
// );

// users.delete(
//   "/users",
//   authMiddlewares.verifyToken,
//   userMiddlewares.validateDeleteId,
//   userControllers.deleteUserbyQuery
// );

export default users;
