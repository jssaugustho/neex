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
  "/leads/:id/:slug",
  resolver(leadMiddlewares.getQuiz),
  resolver(leadMiddlewares.validateStringParams),
  resolver(leadMiddlewares.validateLeadRegister),
  resolver(leadControllers.registerLead),
  resolver(emailControllers.sendLeadNotification),
  resolver(leadControllers.responseLead)
);

leads.put(
  "/leads/:id/:slug/:leadId",
  resolver(leadMiddlewares.getQuiz),
  resolver(leadMiddlewares.validateLeadId),
  resolver(leadMiddlewares.validateStringParams),
  resolver(leadMiddlewares.validateLeadUpdate),
  resolver(leadControllers.updateLead),
  resolver(emailControllers.sendLeadNotification),
  resolver(leadControllers.responseLead)
);

//rota que lista os leads: sort by: updatedAt
leads.get(
  "/leads",
  resolver(authMiddlewares.verifyToken),
  resolver(authMiddlewares.isEmailVerified),
  resolver(leadMiddlewares.validateQuery),
  resolver(leadMiddlewares.validateSortBy),
  resolver(leadControllers.getLeadsbyQuery),
  resolver(leadControllers.responseGetLeads)
);

leads.get(
  "/leads/:id",
  resolver(authMiddlewares.verifyToken),
  resolver(authMiddlewares.isEmailVerified),
  resolver(leadMiddlewares.validateQuery),
  resolver(leadMiddlewares.validateSortBy),
  resolver(leadControllers.getLeadsbyQuery),
  resolver(leadControllers.responseGetLeads)
);

leads.get(
  "/leads/:id/:slug",
  resolver(authMiddlewares.verifyToken),
  resolver(authMiddlewares.isEmailVerified),
  resolver(leadMiddlewares.validateQuery),
  resolver(leadMiddlewares.validateSortBy),
  resolver(leadControllers.getLeadsbyQuery),
  resolver(leadControllers.responseGetLeads)
);

leads.get(
  "/leads/:id/:slug/:leadId",
  resolver(authMiddlewares.verifyToken),
  resolver(authMiddlewares.isEmailVerified),
  resolver(leadMiddlewares.validateQuery),
  resolver(leadMiddlewares.validateSortBy),
  resolver(leadControllers.getLeadsbyQuery),
  resolver(leadControllers.responseGetLeads)
);

leads.delete(
  "/leads/:id/:slug/:leadId",
  resolver(authMiddlewares.verifyToken),
  resolver(authMiddlewares.isEmailVerified),
  resolver(leadMiddlewares.validateQuery),
  resolver(leadMiddlewares.verifyDelete),
  resolver(leadControllers.deleteLead)
);

export default leads;
