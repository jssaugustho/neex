import { Router } from "express";

// controles de acesso
import authMiddlewares from "../middlewares/auth.middlewares.js";

//controles da rota
import leadMiddlewares from "../middlewares/lead.middleware.js";
import leadControllers from "../controllers/lead.controller.js";
import emailControllers from "../controllers/email.controllers.js";

//controles de email

const leads = Router();

//para tratamento de erros em funções async
function resolver(handlerFn) {
  return (req, res, next) => {
    return Promise.resolve(handlerFn(req, res, next)).catch((e) => next(e));
  };
}

//cria leads
leads.post(
  "/leads/:slug",
  resolver(authMiddlewares.accessControl),
  resolver(authMiddlewares.isEmailVerified),
  resolver(leadMiddlewares.getLeadOwner),
  resolver(leadMiddlewares.getQuiz),
  resolver(leadMiddlewares.validateLeadRegister),
  resolver(leadControllers.registerLead),
  resolver(emailControllers.sendLeadNotification),
  resolver(leadControllers.responseLeadCreated)
);

//rota que lista os leads: sort by: updatedAt
leads.get(
  "/leads",
  resolver(authMiddlewares.accessControl),
  resolver(authMiddlewares.isEmailVerified),
  resolver(leadMiddlewares.validateLeadFilter),
  resolver(leadControllers.getLeadsAndFilter)
);

export default leads;
