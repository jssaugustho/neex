import { Router, Request, Response, NextFunction } from "express";

// controles de acesso
import authMiddlewares from "../middlewares/auth.middlewares.js";
import quizMiddlewares from "../middlewares/quiz.middlewares.js";
import quizControllers from "../controllers/quiz.controllers.js";

//controles de email
const leads = Router();

// function resolver(handlerFn: NextFunction) {
//   return (req: Request, res: Response, next: NextFunction) => {
//     return Promise.resolve(handlerFn(req, res, next)).catch((e) => next(e));
//   };
// }

//cria um quiz
leads.post(
  "/quiz/:userId",
  authMiddlewares.verifyToken,
  quizMiddlewares.validateStringParams,
  quizMiddlewares.validateCreateQuizParams,
  quizControllers.createNewQuiz
);
//verifica slug
leads.post(
  "/verify-slug",
  authMiddlewares.verifyToken,
  quizMiddlewares.validateStringParams,
  quizMiddlewares.validateVerifySlug,
  quizControllers.verifySlugExists
);
export default leads;
//# sourceMappingURL=quiz.route.js.map
